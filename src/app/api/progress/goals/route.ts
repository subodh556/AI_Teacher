/**
 * Progress Goals API Endpoints
 *
 * This file contains the API endpoints for user goals in the progress tracking system.
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
  userGoalCreateSchema,
  userGoalUpdateSchema
} from '@/lib/validation';

/**
 * GET /api/progress/goals
 * Returns user goals
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

    const goals = await prisma.userGoal.findMany({
      where: { user_id: user_id as string },
      include: {
        topic: {
          select: {
            name: true,
            description: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(goals);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch user goals');
  }
}

/**
 * POST /api/progress/goals
 * Creates a new user goal
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const validatedData = await validateRequest(body, userGoalCreateSchema);

    const goal = await prisma.userGoal.create({
      data: {
        ...validatedData,
        created_at: new Date(),
        updated_at: new Date()
      },
      include: {
        topic: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create user goal');
  }
}

/**
 * PATCH /api/progress/goals/[id]
 * Updates a user goal
 */
export async function PATCH(request: Request, context: { params: { id: string } }) {
  const { params } = context;
  try {
    const { id } = params;
    const body = await parseRequestBody(request);
    const validatedData = await validateRequest(body, userGoalUpdateSchema);

    const goal = await prisma.userGoal.update({
      where: { id },
      data: {
        ...validatedData,
        updated_at: new Date()
      },
      include: {
        topic: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json(goal);
  } catch (error) {
    return handleApiError(error, 'Failed to update user goal');
  }
}

/**
 * DELETE /api/progress/goals/[id]
 * Deletes a user goal
 */
export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { params } = context;
  try {
    const { id } = params;

    await prisma.userGoal.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    return handleApiError(error, 'Failed to delete user goal');
  }
}
