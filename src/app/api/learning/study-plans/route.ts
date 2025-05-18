/**
 * Study Plans API Endpoints
 * 
 * This file contains the API endpoints for study plan management.
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
  studyPlanCreateSchema, 
  studyPlanUpdateSchema 
} from '@/lib/validation';

/**
 * GET /api/learning/study-plans
 * Returns study plans for a specific user
 */
export async function GET(request: Request) {
  try {
    const params = extractQueryParams(request, ['user_id']);
    const { user_id } = params;
    
    const studyPlans = await prisma.studyPlan.findMany({
      where: { user_id: user_id as string },
      orderBy: { updated_at: 'desc' }
    });
    
    return NextResponse.json(studyPlans);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch study plans');
  }
}

/**
 * POST /api/learning/study-plans
 * Creates a new study plan
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const validatedData = await validateRequest(body, studyPlanCreateSchema);
    
    // Set timestamps
    const now = new Date();
    const data = {
      ...validatedData,
      created_at: now,
      updated_at: now
    };
    
    const studyPlan = await prisma.studyPlan.create({
      data
    });
    
    return NextResponse.json(studyPlan, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create study plan');
  }
}

/**
 * PUT /api/learning/study-plans
 * Updates an existing study plan
 */
export async function PUT(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Study plan ID is required' },
        { status: 400 }
      );
    }
    
    const validatedData = await validateRequest(updateData, studyPlanUpdateSchema);
    
    // Update the timestamp
    const data = {
      ...validatedData,
      updated_at: new Date()
    };
    
    const studyPlan = await prisma.studyPlan.update({
      where: { id },
      data
    });
    
    return NextResponse.json(studyPlan);
  } catch (error) {
    return handleApiError(error, 'Failed to update study plan');
  }
}

/**
 * DELETE /api/learning/study-plans
 * Deletes a study plan
 */
export async function DELETE(request: Request) {
  try {
    const params = extractQueryParams(request, ['id']);
    const { id } = params;
    
    await prisma.studyPlan.delete({
      where: { id: id as string }
    });
    
    return NextResponse.json(
      { message: 'Study plan deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'Failed to delete study plan');
  }
}
