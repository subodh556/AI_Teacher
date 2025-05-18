/**
 * Levels API Endpoints
 *
 * This file contains the API endpoints for the level progression system.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  handleApiError,
  validateRequest,
  extractQueryParams,
  parseRequestBody
} from '@/lib/api-utils';
import { userLevelCreateSchema, userLevelUpdateSchema } from '@/lib/validation';

/**
 * GET /api/gamification/levels
 * Returns level information for a specific user
 */
export async function GET(request: Request) {
  try {
    const params = extractQueryParams(request, ['user_id']);
    const { user_id } = params;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    try {
      // Get user level
      const userLevel = await prisma.userLevel.findUnique({
        where: { user_id: user_id as string }
      });

      if (!userLevel) {
        // Return default values if level not found
        return NextResponse.json({
          id: 'default',
          user_id: user_id,
          current_level: 1,
          experience: 0,
          next_level_exp: 100,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      return NextResponse.json(userLevel);
    } catch (error) {
      // If there's a database error (e.g., table doesn't exist), return default values
      console.error('Database error fetching level:', error);
      return NextResponse.json({
        id: 'default',
        user_id: user_id,
        current_level: 1,
        experience: 0,
        next_level_exp: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('API error fetching level:', error);
    // Return default values on any error
    return NextResponse.json({
      id: 'default',
      user_id: 'default',
      current_level: 1,
      experience: 0,
      next_level_exp: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
}

/**
 * POST /api/gamification/levels
 * Creates or updates a user's level
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const validatedData = await validateRequest(body, userLevelCreateSchema);

    // Check if level already exists for this user
    const existingLevel = await prisma.userLevel.findUnique({
      where: { user_id: validatedData.user_id }
    });

    if (existingLevel) {
      // Update existing level
      const updatedLevel = await prisma.userLevel.update({
        where: { user_id: validatedData.user_id },
        data: {
          current_level: validatedData.current_level,
          experience: validatedData.experience,
          next_level_exp: validatedData.next_level_exp,
          updated_at: new Date()
        }
      });

      return NextResponse.json(updatedLevel);
    } else {
      // Create new level
      const newLevel = await prisma.userLevel.create({
        data: {
          user_id: validatedData.user_id,
          current_level: validatedData.current_level || 1,
          experience: validatedData.experience || 0,
          next_level_exp: validatedData.next_level_exp || 100,
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      return NextResponse.json(newLevel, { status: 201 });
    }
  } catch (error) {
    return handleApiError(error, 'Failed to create/update user level');
  }
}

/**
 * PUT /api/gamification/levels/add-experience
 * Adds experience points to a user and handles level-ups
 */
export async function PUT(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const { user_id, experience_points, source } = body;

    if (!user_id || !experience_points) {
      return NextResponse.json(
        { error: 'User ID and experience points are required' },
        { status: 400 }
      );
    }

    // Get user level
    let userLevel = await prisma.userLevel.findUnique({
      where: { user_id }
    });

    if (!userLevel) {
      // Create new level for user
      userLevel = await prisma.userLevel.create({
        data: {
          user_id,
          current_level: 1,
          experience: 0,
          next_level_exp: 100,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }

    // Add experience points
    let newExperience = userLevel.experience + experience_points;
    let newLevel = userLevel.current_level;
    let newNextLevelExp = userLevel.next_level_exp;
    let leveledUp = false;

    // Check if user leveled up
    while (newExperience >= newNextLevelExp) {
      newExperience -= newNextLevelExp;
      newLevel++;
      newNextLevelExp = calculateNextLevelExp(newLevel);
      leveledUp = true;
    }

    // Update user level
    const updatedLevel = await prisma.userLevel.update({
      where: { user_id },
      data: {
        current_level: newLevel,
        experience: newExperience,
        next_level_exp: newNextLevelExp,
        updated_at: new Date()
      }
    });

    // Log experience gain
    await prisma.progressMetric.create({
      data: {
        user_id,
        metric_type: 'experience_gain',
        metric_value: experience_points,
        metric_data: {
          source: source || 'unknown',
          level_up: leveledUp,
          new_level: leveledUp ? newLevel : null
        },
        date: new Date()
      }
    });

    return NextResponse.json({
      level: updatedLevel,
      leveledUp,
      experienceAdded: experience_points
    });
  } catch (error) {
    return handleApiError(error, 'Failed to add experience points');
  }
}

/**
 * Calculate experience points required for the next level
 * Uses a common RPG formula: next_level_exp = base_exp * (level ^ 1.5)
 */
function calculateNextLevelExp(level: number): number {
  const baseExp = 100;
  return Math.round(baseExp * Math.pow(level, 1.5));
}
