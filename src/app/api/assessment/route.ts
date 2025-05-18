/**
 * Assessment API Endpoints
 * 
 * This file contains the API endpoints for assessment functionality.
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
  assessmentCreateSchema, 
  assessmentUpdateSchema 
} from '@/lib/validation';

/**
 * GET /api/assessment
 * Returns all assessments or filtered by topic
 */
export async function GET(request: Request) {
  try {
    const params = extractQueryParams(request);
    const { topic_id } = params;
    
    const assessments = await prisma.assessment.findMany({
      where: topic_id ? { topic_id: topic_id as string } : undefined,
      include: {
        topic: {
          select: {
            name: true,
            difficulty_level: true
          }
        },
        _count: {
          select: {
            questions: true
          }
        }
      }
    });
    
    return NextResponse.json(assessments);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch assessments');
  }
}

/**
 * POST /api/assessment
 * Creates a new assessment
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const validatedData = await validateRequest(body, assessmentCreateSchema);
    
    const assessment = await prisma.assessment.create({
      data: validatedData
    });
    
    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create assessment');
  }
}

/**
 * PUT /api/assessment
 * Updates an existing assessment
 */
export async function PUT(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }
    
    const validatedData = await validateRequest(updateData, assessmentUpdateSchema);
    
    const assessment = await prisma.assessment.update({
      where: { id },
      data: validatedData
    });
    
    return NextResponse.json(assessment);
  } catch (error) {
    return handleApiError(error, 'Failed to update assessment');
  }
}

/**
 * DELETE /api/assessment
 * Deletes an assessment
 */
export async function DELETE(request: Request) {
  try {
    const params = extractQueryParams(request, ['id']);
    const { id } = params;
    
    // Delete associated questions first
    await prisma.question.deleteMany({
      where: { assessment_id: id as string }
    });
    
    // Delete the assessment
    await prisma.assessment.delete({
      where: { id: id as string }
    });
    
    return NextResponse.json(
      { message: 'Assessment deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'Failed to delete assessment');
  }
}
