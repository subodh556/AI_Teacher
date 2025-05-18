/**
 * Progress API Endpoints
 *
 * This file contains the API endpoints for user progress tracking.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  handleApiError,
  validateRequest,
  extractQueryParams,
  parseRequestBody
} from '@/lib/api-utils';
import {
  userProgressCreateSchema,
  userProgressUpdateSchema
} from '@/lib/validation';

/**
 * Helper function to get user progress
 */
async function getProgress(request: Request) {
  try {
    const params = extractQueryParams(request, ['user_id']);
    const { user_id } = params;

    const progress = await prisma.userProgress.findMany({
      where: { user_id: user_id as string },
      include: {
        topic: {
          select: {
            name: true,
            description: true,
            difficulty_level: true
          }
        }
      },
      orderBy: { last_interaction: 'desc' }
    });

    // Get overall stats
    const completedTopics = progress.filter(p => p.completed).length;
    const totalTopics = await prisma.topic.count();
    const averageProficiency = progress.length > 0
      ? progress.reduce((sum, p) => sum + p.proficiency_level, 0) / progress.length
      : 0;

    return NextResponse.json({
      progress,
      stats: {
        completedTopics,
        totalTopics,
        averageProficiency,
        progressPercentage: totalTopics > 0
          ? Math.round((completedTopics / totalTopics) * 100)
          : 0
      }
    });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch progress');
  }
}

/**
 * POST /api/progress
 * Updates user progress
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);

    // Check if it's an update or create operation
    if (body.id) {
      // Update existing progress
      const { id, ...updateData } = body;
      const validatedData = await validateRequest(updateData, userProgressUpdateSchema);

      const progress = await prisma.userProgress.update({
        where: { id },
        data: {
          ...validatedData,
          last_interaction: new Date()
        }
      });

      return NextResponse.json(progress);
    } else {
      // Create new progress
      const validatedData = await validateRequest(body, userProgressCreateSchema);

      const progress = await prisma.userProgress.create({
        data: {
          ...validatedData,
          last_interaction: new Date()
        }
      });

      return NextResponse.json(progress, { status: 201 });
    }
  } catch (error) {
    return handleApiError(error, 'Failed to update progress');
  }
}

/**
 * GET /api/progress
 * Returns user progress or summary based on the endpoint
 */
export async function GET(request: Request) {
  // Check if this is the summary endpoint
  const url = new URL(request.url);
  if (url.pathname.endsWith('/summary')) {
    return getSummary(request);
  }

  // This is the main progress endpoint
  return getProgress(request);
}

/**
 * Helper function to get a summary of user progress across all topics
 */
async function getSummary(request: Request) {
  try {
    const params = extractQueryParams(request, ['user_id']);
    const { user_id } = params;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user progress
    const progress = await prisma.userProgress.findMany({
      where: { user_id: user_id as string },
      include: {
        topic: {
          select: {
            name: true,
            description: true
          }
        }
      }
    });

    // Get assessment results
    const assessments = await prisma.userAssessment.findMany({
      where: { user_id: user_id as string },
      orderBy: { completed_at: 'desc' },
      take: 5,
      include: {
        assessment: {
          select: {
            title: true,
            topic: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Get achievements
    const achievements = await prisma.userAchievement.findMany({
      where: { user_id: user_id as string },
      include: {
        achievement: true
      }
    });

    // Get recent activities
    const recentActivities = await prisma.userActivity.findMany({
      where: { user_id: user_id as string },
      orderBy: { created_at: 'desc' },
      take: 10,
      include: {
        topic: {
          select: {
            name: true
          }
        }
      }
    });

    // Get user goals
    const goals = await prisma.userGoal.findMany({
      where: {
        user_id: user_id as string,
        completed: false
      },
      orderBy: { created_at: 'desc' },
      take: 5,
      include: {
        topic: {
          select: {
            name: true
          }
        }
      }
    });

    // Get metrics
    const streakMetric = await prisma.progressMetric.findFirst({
      where: {
        user_id: user_id as string,
        metric_type: 'daily_streak'
      },
      orderBy: { date: 'desc' }
    });

    const weeklyProgressMetric = await prisma.progressMetric.findFirst({
      where: {
        user_id: user_id as string,
        metric_type: 'weekly_progress'
      },
      orderBy: { date: 'desc' }
    });

    const timeSpentMetric = await prisma.progressMetric.findFirst({
      where: {
        user_id: user_id as string,
        metric_type: 'time_spent'
      },
      orderBy: { date: 'desc' }
    });

    // Calculate summary statistics
    const completedTopics = progress.filter(p => p.completed).length;
    const totalTopics = await prisma.topic.count();
    const averageProficiency = progress.length > 0
      ? progress.reduce((sum, p) => sum + p.proficiency_level, 0) / progress.length
      : 0;
    const recentAssessmentScore = assessments.length > 0 ? assessments[0].score : null;

    // Calculate strengths and weaknesses
    const topicProgressData = progress.map(p => ({
      id: p.topic_id,
      name: p.topic.name,
      description: p.topic.description,
      proficiencyLevel: p.proficiency_level,
      completed: p.completed,
      lastInteraction: p.last_interaction
    }));

    // Sort by proficiency level
    const sortedTopics = [...topicProgressData].sort((a, b) => b.proficiencyLevel - a.proficiencyLevel);
    const strengths = sortedTopics.slice(0, 3);
    const weaknesses = [...sortedTopics].sort((a, b) => a.proficiencyLevel - b.proficiencyLevel).slice(0, 3);

    return NextResponse.json({
      completedTopics,
      totalTopics,
      progressPercentage: totalTopics > 0
        ? Math.round((completedTopics / totalTopics) * 100)
        : 0,
      averageProficiency,
      recentAssessments: assessments,
      recentAssessmentScore,
      achievementCount: achievements.length,
      recentAchievements: achievements
        .sort((a, b) => new Date(b.earned_at || 0).getTime() - new Date(a.earned_at || 0).getTime())
        .slice(0, 3)
        .map(a => a.achievement),
      currentStreak: streakMetric?.metric_value || 0,
      weeklyProgress: weeklyProgressMetric?.metric_value || 0,
      timeSpent: timeSpentMetric?.metric_value || 0,
      recentActivities: recentActivities.map(a => ({
        id: a.id,
        activityType: a.activity_type,
        topicId: a.topic_id,
        topicName: a.topic?.name,
        duration: a.duration,
        createdAt: a.created_at,
        activityData: a.activity_data
      })),
      goals: goals.map(g => ({
        id: g.id,
        title: g.title,
        description: g.description,
        targetValue: g.target_value,
        currentValue: g.current_value,
        goalType: g.goal_type,
        topicId: g.topic_id,
        topicName: g.topic?.name,
        startDate: g.start_date,
        endDate: g.end_date,
        completed: g.completed
      })),
      topicProgress: topicProgressData,
      strengths,
      weaknesses
    });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch progress summary');
  }
}
