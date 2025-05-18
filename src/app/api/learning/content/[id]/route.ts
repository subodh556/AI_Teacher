/**
 * Learning Content API Endpoints for a specific content item
 *
 * This file contains the API endpoints for operations on a specific content item.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-utils';

type Params = {
  id: string;
}

/**
 * GET /api/learning/content/[id]
 * Returns a specific content item
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = params;

    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        topic: {
          select: {
            name: true,
            description: true,
            difficulty_level: true
          }
        }
      }
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch content');
  }
}

/**
 * POST /api/learning/content/[id]/track
 * Tracks user interaction with content
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate required fields
    if (!body.userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { userId, completed = false } = body;

    // Get the content to find its topic
    const content = await prisma.content.findUnique({
      where: { id },
      select: { topic_id: true }
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Update user progress for the topic
    const progress = await prisma.userProgress.upsert({
      where: {
        user_id_topic_id: {
          user_id: userId,
          topic_id: content.topic_id
        }
      },
      update: {
        last_interaction: new Date(),
        completed: completed || undefined
      },
      create: {
        user_id: userId,
        topic_id: content.topic_id,
        proficiency_level: 0,
        last_interaction: new Date(),
        completed
      }
    });

    return NextResponse.json({
      message: 'Progress tracked successfully',
      progress
    });
  } catch (error) {
    return handleApiError(error, 'Failed to track content interaction');
  }
}
