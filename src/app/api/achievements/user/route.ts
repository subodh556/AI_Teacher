/**
 * User Achievements API Endpoints
 * 
 * This file contains the API endpoints for user achievements.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  handleApiError, 
  validateRequest, 
  extractQueryParams,
  parseRequestBody
} from '@/lib/api-utils';
import { userAchievementCreateSchema } from '@/lib/validation';

/**
 * GET /api/achievements/user
 * Returns achievements for a specific user
 */
export async function GET(request: Request) {
  try {
    const params = extractQueryParams(request, ['user_id']);
    const { user_id } = params;
    
    const userAchievements = await prisma.userAchievement.findMany({
      where: { user_id: user_id as string },
      include: {
        achievement: true
      },
      orderBy: { earned_at: 'desc' }
    });
    
    return NextResponse.json(userAchievements);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch user achievements');
  }
}

/**
 * POST /api/achievements/user
 * Awards an achievement to a user
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const validatedData = await validateRequest(body, userAchievementCreateSchema);
    
    // Check if the user already has this achievement
    const existingAchievement = await prisma.userAchievement.findFirst({
      where: {
        user_id: validatedData.user_id,
        achievement_id: validatedData.achievement_id
      }
    });
    
    if (existingAchievement) {
      return NextResponse.json(
        { error: 'User already has this achievement' },
        { status: 400 }
      );
    }
    
    // Award the achievement
    const userAchievement = await prisma.userAchievement.create({
      data: {
        ...validatedData,
        earned_at: new Date()
      },
      include: {
        achievement: true
      }
    });
    
    return NextResponse.json(userAchievement, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to award achievement');
  }
}

/**
 * DELETE /api/achievements/user
 * Removes an achievement from a user
 */
export async function DELETE(request: Request) {
  try {
    const params = extractQueryParams(request, ['user_id', 'achievement_id']);
    const { user_id, achievement_id } = params;
    
    await prisma.userAchievement.deleteMany({
      where: {
        user_id: user_id as string,
        achievement_id: achievement_id as string
      }
    });
    
    return NextResponse.json(
      { message: 'Achievement removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'Failed to remove achievement');
  }
}

/**
 * POST /api/achievements/user/check
 * Checks if a user qualifies for any new achievements
 */
export async function check(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const { user_id } = body;
    
    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Get user's current achievements
    const currentAchievements = await prisma.userAchievement.findMany({
      where: { user_id },
      select: { achievement_id: true }
    });
    
    const currentAchievementIds = currentAchievements.map(a => a.achievement_id);
    
    // Get all achievements
    const allAchievements = await prisma.achievement.findMany({
      where: {
        id: { notIn: currentAchievementIds }
      }
    });
    
    // Get user progress data
    const userProgress = await prisma.userProgress.findMany({
      where: { user_id }
    });
    
    const completedTopics = userProgress.filter(p => p.completed).length;
    
    // Get user assessment data
    const userAssessments = await prisma.userAssessment.findMany({
      where: { user_id }
    });
    
    const highScoreAssessments = userAssessments.filter(a => a.score >= 90).length;
    
    // Check for achievements
    const newAchievements = [];
    
    for (const achievement of allAchievements) {
      const criteria = achievement.criteria as any;
      
      // Check topic completion achievements
      if (criteria.completedTopics && completedTopics >= criteria.completedTopics) {
        newAchievements.push(achievement);
        continue;
      }
      
      // Check high score achievements
      if (criteria.highScoreAssessments && highScoreAssessments >= criteria.highScoreAssessments) {
        newAchievements.push(achievement);
        continue;
      }
      
      // Add more achievement criteria checks as needed
    }
    
    // Award new achievements
    const awardedAchievements = [];
    
    for (const achievement of newAchievements) {
      const userAchievement = await prisma.userAchievement.create({
        data: {
          user_id,
          achievement_id: achievement.id,
          earned_at: new Date()
        },
        include: {
          achievement: true
        }
      });
      
      awardedAchievements.push(userAchievement);
    }
    
    return NextResponse.json({
      newAchievements: awardedAchievements,
      count: awardedAchievements.length
    });
  } catch (error) {
    return handleApiError(error, 'Failed to check achievements');
  }
}
