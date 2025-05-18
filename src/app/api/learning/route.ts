/**
 * Learning API Endpoints
 * 
 * This file contains the API endpoints for learning content management.
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
  contentCreateSchema, 
  contentUpdateSchema 
} from '@/lib/validation';

/**
 * GET /api/learning
 * Returns all learning content or filtered by topic
 */
export async function GET(request: Request) {
  try {
    const params = extractQueryParams(request);
    const { topic_id } = params;
    
    const content = await prisma.content.findMany({
      where: topic_id ? { topic_id: topic_id as string } : undefined,
      include: {
        topic: {
          select: {
            name: true,
            difficulty_level: true
          }
        }
      },
      orderBy: [
        { topic_id: 'asc' },
        { difficulty_level: 'asc' }
      ]
    });
    
    return NextResponse.json(content);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch learning content');
  }
}

/**
 * POST /api/learning
 * Creates new learning content
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const validatedData = await validateRequest(body, contentCreateSchema);
    
    const content = await prisma.content.create({
      data: validatedData
    });
    
    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create learning content');
  }
}

/**
 * PUT /api/learning
 * Updates existing learning content
 */
export async function PUT(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }
    
    const validatedData = await validateRequest(updateData, contentUpdateSchema);
    
    const content = await prisma.content.update({
      where: { id },
      data: validatedData
    });
    
    return NextResponse.json(content);
  } catch (error) {
    return handleApiError(error, 'Failed to update learning content');
  }
}

/**
 * DELETE /api/learning
 * Deletes learning content
 */
export async function DELETE(request: Request) {
  try {
    const params = extractQueryParams(request, ['id']);
    const { id } = params;
    
    await prisma.content.delete({
      where: { id: id as string }
    });
    
    return NextResponse.json(
      { message: 'Learning content deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'Failed to delete learning content');
  }
}
