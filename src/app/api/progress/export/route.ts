/**
 * Progress Export API Endpoint
 *
 * This file contains the API endpoint for exporting progress data.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  handleApiError,
  validateRequest,
  extractQueryParams,
  parseRequestBody
} from '@/lib/api-utils';
import { progressExportSchema } from '@/lib/validation';

/**
 * POST /api/progress/export
 * Exports progress data for a user
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const validatedData = await validateRequest(body, progressExportSchema);
    
    const {
      user_id,
      start_date,
      end_date,
      include_activities = true,
      include_assessments = true,
      include_achievements = true,
      include_metrics = true,
      format = 'json'
    } = validatedData;

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: user_id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Build date filters
    const dateFilter: any = {};
    if (start_date) {
      dateFilter.gte = new Date(start_date);
    }
    if (end_date) {
      dateFilter.lte = new Date(end_date);
    }

    // Get progress summary
    const progressSummary = await getProgressSummary(user_id);

    // Get topic progress
    const topicProgress = await prisma.userProgress.findMany({
      where: { user_id },
      include: {
        topic: {
          select: {
            name: true,
            description: true
          }
        }
      }
    });

    // Initialize export data
    const exportData: any = {
      userData: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      summary: progressSummary,
      topicProgress: topicProgress.map(tp => ({
        id: tp.topic_id,
        name: tp.topic.name,
        description: tp.topic.description,
        proficiencyLevel: tp.proficiency_level,
        completed: tp.completed,
        lastInteraction: tp.last_interaction
      })),
      exportDate: new Date().toISOString(),
      format
    };

    // Add activities if requested
    if (include_activities) {
      const activities = await prisma.userActivity.findMany({
        where: {
          user_id,
          ...(Object.keys(dateFilter).length > 0 ? { created_at: dateFilter } : {})
        },
        include: {
          topic: {
            select: {
              name: true
            }
          }
        },
        orderBy: { created_at: 'desc' }
      });

      exportData.activities = activities.map(a => ({
        id: a.id,
        activityType: a.activity_type,
        topicId: a.topic_id,
        topicName: a.topic?.name,
        duration: a.duration,
        createdAt: a.created_at,
        activityData: a.activity_data
      }));
    }

    // Add assessments if requested
    if (include_assessments) {
      const assessments = await prisma.userAssessment.findMany({
        where: {
          user_id,
          ...(Object.keys(dateFilter).length > 0 ? { completed_at: dateFilter } : {})
        },
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
        },
        orderBy: { completed_at: 'desc' }
      });

      exportData.assessments = assessments.map(a => ({
        id: a.id,
        assessmentId: a.assessment_id,
        assessmentTitle: a.assessment.title,
        topicName: a.assessment.topic.name,
        score: a.score,
        completedAt: a.completed_at,
        answers: a.answers
      }));
    }

    // Add achievements if requested
    if (include_achievements) {
      const achievements = await prisma.userAchievement.findMany({
        where: {
          user_id,
          ...(Object.keys(dateFilter).length > 0 ? { earned_at: dateFilter } : {})
        },
        include: {
          achievement: true
        },
        orderBy: { earned_at: 'desc' }
      });

      exportData.achievements = achievements.map(a => ({
        id: a.achievement.id,
        name: a.achievement.name,
        description: a.achievement.description,
        iconUrl: a.achievement.icon_url,
        earnedAt: a.earned_at
      }));
    }

    // Add metrics if requested
    if (include_metrics) {
      const metrics = await prisma.progressMetric.findMany({
        where: {
          user_id,
          ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {})
        },
        orderBy: { date: 'desc' }
      });

      exportData.metrics = metrics.map(m => ({
        id: m.id,
        metricType: m.metric_type,
        metricValue: m.metric_value,
        metricData: m.metric_data,
        date: m.date
      }));
    }

    // Convert to CSV if requested
    if (format === 'csv') {
      // Implementation for CSV conversion would go here
      // For now, we'll just return JSON with a note
      exportData.format = 'json';
      exportData.note = 'CSV format is not yet implemented. Data is returned as JSON.';
    }

    return NextResponse.json(exportData);
  } catch (error) {
    return handleApiError(error, 'Failed to export progress data');
  }
}

/**
 * Helper function to get progress summary for a user
 */
async function getProgressSummary(userId: string) {
  // Get user progress
  const progress = await prisma.userProgress.findMany({
    where: { user_id: userId }
  });

  // Get assessment results
  const assessments = await prisma.userAssessment.findMany({
    where: { user_id: userId },
    orderBy: { completed_at: 'desc' },
    take: 5
  });

  // Get achievements
  const achievements = await prisma.userAchievement.findMany({
    where: { user_id: userId }
  });

  // Calculate summary statistics
  const completedTopics = progress.filter(p => p.completed).length;
  const totalTopics = await prisma.topic.count();
  const averageProficiency = progress.length > 0
    ? progress.reduce((sum, p) => sum + p.proficiency_level, 0) / progress.length
    : 0;
  const recentAssessmentScore = assessments.length > 0 ? assessments[0].score : null;

  // Get streak from metrics
  const streakMetric = await prisma.progressMetric.findFirst({
    where: {
      user_id: userId,
      metric_type: 'daily_streak'
    },
    orderBy: { date: 'desc' }
  });

  // Get weekly progress from metrics
  const weeklyProgressMetric = await prisma.progressMetric.findFirst({
    where: {
      user_id: userId,
      metric_type: 'weekly_progress'
    },
    orderBy: { date: 'desc' }
  });

  // Get time spent from metrics
  const timeSpentMetric = await prisma.progressMetric.findFirst({
    where: {
      user_id: userId,
      metric_type: 'time_spent'
    },
    orderBy: { date: 'desc' }
  });

  return {
    completedTopics,
    totalTopics,
    progressPercentage: totalTopics > 0
      ? Math.round((completedTopics / totalTopics) * 100)
      : 0,
    averageProficiency,
    recentAssessmentScore,
    achievementCount: achievements.length,
    currentStreak: streakMetric?.metric_value || 0,
    weeklyProgress: weeklyProgressMetric?.metric_value || 0,
    timeSpent: timeSpentMetric?.metric_value || 0
  };
}
