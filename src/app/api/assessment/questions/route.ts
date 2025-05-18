/**
 * Assessment Questions API Endpoints
 * 
 * This file contains the API endpoints for assessment questions.
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
  questionCreateSchema, 
  questionUpdateSchema 
} from '@/lib/validation';

/**
 * GET /api/assessment/questions
 * Returns questions for a specific assessment
 */
export async function GET(request: Request) {
  try {
    const params = extractQueryParams(request, ['assessment_id']);
    const { assessment_id } = params;
    
    const questions = await prisma.question.findMany({
      where: { assessment_id: assessment_id as string },
      orderBy: { difficulty_level: 'asc' }
    });
    
    return NextResponse.json(questions);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch questions');
  }
}

/**
 * POST /api/assessment/questions
 * Creates a new question
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const validatedData = await validateRequest(body, questionCreateSchema);
    
    const question = await prisma.question.create({
      data: validatedData
    });
    
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create question');
  }
}

/**
 * PUT /api/assessment/questions
 * Updates an existing question
 */
export async function PUT(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }
    
    const validatedData = await validateRequest(updateData, questionUpdateSchema);
    
    const question = await prisma.question.update({
      where: { id },
      data: validatedData
    });
    
    return NextResponse.json(question);
  } catch (error) {
    return handleApiError(error, 'Failed to update question');
  }
}

/**
 * DELETE /api/assessment/questions
 * Deletes a question
 */
export async function DELETE(request: Request) {
  try {
    const params = extractQueryParams(request, ['id']);
    const { id } = params;
    
    await prisma.question.delete({
      where: { id: id as string }
    });
    
    return NextResponse.json(
      { message: 'Question deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'Failed to delete question');
  }
}
