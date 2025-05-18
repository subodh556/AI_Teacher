/**
 * Achievements API Endpoints
 * 
 * This file contains the API endpoints for the gamification system.
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
  achievementCreateSchema, 
  achievementUpdateSchema,
  userAchievementCreateSchema
} from '@/lib/validation';

/**
 * GET /api/achievements
 * Returns all achievements or achievements for a specific user
 */
export async function GET(request: Request) {
  try {
    const params = extractQueryParams(request);
    const { user_id } = params;
    
    if (user_id) {
      // Get achievements for a specific user
      const userAchievements = await prisma.userAchievement.findMany({
        where: { user_id: user_id as string },
        include: {
          achievement: true
        },
        orderBy: { earned_at: 'desc' }
      });
      
      return NextResponse.json(userAchievements.map(ua => ({
        ...ua.achievement,
        earned_at: ua.earned_at
      })));
    } else {
      // Get all achievements
      const achievements = await prisma.achievement.findMany();
      return NextResponse.json(achievements);
    }
  } catch (error) {
    return handleApiError(error, 'Failed to fetch achievements');
  }
}

/**
 * POST /api/achievements
 * Creates a new achievement
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const validatedData = await validateRequest(body, achievementCreateSchema);
    
    const achievement = await prisma.achievement.create({
      data: validatedData
    });
    
    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create achievement');
  }
}

/**
 * PUT /api/achievements
 * Updates an existing achievement
 */
export async function PUT(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Achievement ID is required' },
        { status: 400 }
      );
    }
    
    const validatedData = await validateRequest(updateData, achievementUpdateSchema);
    
    const achievement = await prisma.achievement.update({
      where: { id },
      data: validatedData
    });
    
    return NextResponse.json(achievement);
  } catch (error) {
    return handleApiError(error, 'Failed to update achievement');
  }
}

/**
 * DELETE /api/achievements
 * Deletes an achievement
 */
export async function DELETE(request: Request) {
  try {
    const params = extractQueryParams(request, ['id']);
    const { id } = params;
    
    // Delete associated user achievements first
    await prisma.userAchievement.deleteMany({
      where: { achievement_id: id as string }
    });
    
    // Delete the achievement
    await prisma.achievement.delete({
      where: { id: id as string }
    });
    
    return NextResponse.json(
      { message: 'Achievement deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'Failed to delete achievement');
  }
}
