/**
 * Progress Activities API Endpoints
 *
 * This file contains the API endpoints for user activities in the progress tracking system.
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
  userActivityCreateSchema
} from '@/lib/validation';

/**
 * GET /api/progress/activities
 * Returns user activities
 */
export async function GET(request: Request) {
  try {
    const params = extractQueryParams(request, ['user_id', 'limit', 'offset', 'activity_type']);
    const { user_id, limit = '10', offset = '0', activity_type } = params;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const activities = await prisma.userActivity.findMany({
      where: {
        user_id: user_id as string,
        ...(activity_type ? { activity_type: activity_type as string } : {})
      },
      include: {
        topic: {
          select: {
            name: true,
            description: true
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    // Get total count for pagination
    const totalCount = await prisma.userActivity.count({
      where: {
        user_id: user_id as string,
        ...(activity_type ? { activity_type: activity_type as string } : {})
      }
    });

    return NextResponse.json({
      activities,
      pagination: {
        total: totalCount,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch user activities');
  }
}

/**
 * POST /api/progress/activities
 * Creates a new user activity
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const validatedData = await validateRequest(body, userActivityCreateSchema);

    const activity = await prisma.userActivity.create({
      data: {
        ...validatedData,
        created_at: new Date()
      },
      include: {
        topic: {
          select: {
            name: true
          }
        }
      }
    });

    // Update user goals if applicable
    if (validatedData.topic_id) {
      await updateGoalsForActivity(validatedData.user_id, validatedData.activity_type);
    }

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create user activity');
  }
}

/**
 * Helper function to update goals based on new activity
 */
async function updateGoalsForActivity(userId: string, activityType: string) {
  try {
    // Find active goals for the user
    const activeGoals = await prisma.userGoal.findMany({
      where: {
        user_id: userId,
        completed: false,
        end_date: {
          gte: new Date()
        }
      }
    });

    // Update relevant goals
    for (const goal of activeGoals) {
      if (
        (goal.goal_type === 'daily' && isToday(goal.start_date)) ||
        (goal.goal_type === 'weekly' && isThisWeek(goal.start_date)) ||
        (goal.goal_type === 'monthly' && isThisMonth(goal.start_date)) ||
        goal.goal_type === 'total'
      ) {
        // Increment the current value
        await prisma.userGoal.update({
          where: { id: goal.id },
          data: {
            current_value: {
              increment: 1
            },
            // Mark as completed if target is reached
            completed: goal.current_value + 1 >= goal.target_value,
            updated_at: new Date()
          }
        });
      }
    }
  } catch (error) {
    console.error('Error updating goals:', error);
  }
}

// Helper date functions
function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

function isThisWeek(date: Date): boolean {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  
  return date >= weekStart && date < weekEnd;
}

function isThisMonth(date: Date): boolean {
  const now = new Date();
  return date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
}
