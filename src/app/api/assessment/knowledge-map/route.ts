/**
 * Knowledge Map API Endpoints
 * 
 * This file contains API endpoints for the knowledge mapping system.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { handleApiError, extractQueryParams } from '@/lib/api-utils';

/**
 * GET /api/assessment/knowledge-map
 * Returns the knowledge map for a user
 */
export async function GET(request: Request) {
  try {
    const params = extractQueryParams(request);
    const { userId } = params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Get all topics (knowledge areas)
    const topics = await prisma.topic.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        parent_id: true,
        difficulty_level: true,
      }
    });
    
    // Get user progress for all topics
    const userProgress = await prisma.userProgress.findMany({
      where: {
        user_id: userId as string,
      },
      select: {
        id: true,
        topic_id: true,
        proficiency_level: true,
        last_interaction: true,
        completed: true,
      }
    });
    
    // Get recent assessment results to identify knowledge gaps
    const recentAssessments = await prisma.userAssessment.findMany({
      where: {
        user_id: userId as string,
      },
      orderBy: {
        completed_at: 'desc',
      },
      take: 10,
      select: {
        id: true,
        assessment_id: true,
        score: true,
        completed_at: true,
        answers: true,
        assessment: {
          select: {
            topic_id: true,
          }
        }
      }
    });
    
    // Identify knowledge gaps based on assessment results
    const knowledgeGaps = new Set<string>();
    
    for (const assessment of recentAssessments) {
      // If score is below 70%, consider it a knowledge gap
      if (assessment.score < 70) {
        knowledgeGaps.add(assessment.assessment.topic_id);
      }
      
      // Check individual question results
      const answers = assessment.answers as any[];
      if (Array.isArray(answers)) {
        for (const answer of answers) {
          if (!answer.correct && answer.knowledgeAreaId) {
            knowledgeGaps.add(answer.knowledgeAreaId);
          }
        }
      }
    }
    
    // Build the knowledge map
    const knowledgeMap = {
      userId,
      areas: topics.map(topic => {
        const progress = userProgress.find(p => p.topic_id === topic.id);
        
        return {
          areaId: topic.id,
          name: topic.name,
          description: topic.description,
          parentId: topic.parent_id,
          proficiency: progress?.proficiency_level || 0,
          lastAssessed: progress?.last_interaction?.toISOString() || null,
          needsReview: knowledgeGaps.has(topic.id),
          completed: progress?.completed || false,
        };
      }),
    };
    
    return NextResponse.json(knowledgeMap);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch knowledge map');
  }
}

// Schema for updating knowledge map
const updateKnowledgeMapSchema = z.object({
  userId: z.string(),
  areas: z.array(z.object({
    areaId: z.string(),
    proficiency: z.number().min(0).max(100),
    needsReview: z.boolean().optional(),
  })),
});

/**
 * POST /api/assessment/knowledge-map
 * Updates the knowledge map for a user
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = updateKnowledgeMapSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { userId, areas } = validationResult.data;
    
    // Update each knowledge area
    const updates = [];
    
    for (const area of areas) {
      // Check if knowledge area exists for user
      const existingArea = await prisma.userProgress.findFirst({
        where: {
          user_id: userId,
          topic_id: area.areaId,
        }
      });
      
      if (existingArea) {
        // Update existing knowledge area
        updates.push(
          prisma.userProgress.update({
            where: { id: existingArea.id },
            data: {
              proficiency_level: area.proficiency,
              last_interaction: new Date(),
            }
          })
        );
      } else {
        // Create new knowledge area entry
        updates.push(
          prisma.userProgress.create({
            data: {
              user_id: userId,
              topic_id: area.areaId,
              proficiency_level: area.proficiency,
              last_interaction: new Date(),
              completed: false,
            }
          })
        );
      }
    }
    
    // Execute all updates
    await Promise.all(updates);
    
    return NextResponse.json({
      message: 'Knowledge map updated successfully',
      updatedAreas: areas.length,
    });
  } catch (error) {
    return handleApiError(error, 'Failed to update knowledge map');
  }
}
