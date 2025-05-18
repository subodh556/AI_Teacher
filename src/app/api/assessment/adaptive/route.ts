/**
 * Adaptive Assessment API Endpoints
 * 
 * This file contains API endpoints for the adaptive assessment system.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { handleApiError, extractQueryParams } from '@/lib/api-utils';
import { QuestionDifficulty } from '@/types/assessment';

// Schema for adaptive question request
const adaptiveQuestionRequestSchema = z.object({
  assessmentId: z.string().uuid(),
  userId: z.string(),
  currentDifficulty: z.number().int().min(1).max(5),
  answeredQuestionIds: z.array(z.string().uuid()).optional(),
  knowledgeAreaIds: z.array(z.string()).optional(),
});

/**
 * GET /api/assessment/adaptive
 * Returns the next question for an adaptive assessment based on user performance
 */
export async function GET(request: Request) {
  try {
    const params = extractQueryParams(request);
    
    // Validate request parameters
    const validationResult = adaptiveQuestionRequestSchema.safeParse(params);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { 
      assessmentId, 
      userId, 
      currentDifficulty, 
      answeredQuestionIds = [],
      knowledgeAreaIds = []
    } = validationResult.data;
    
    // Get assessment to verify it exists and is adaptive
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
    });
    
    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }
    
    if (!assessment.adaptive) {
      return NextResponse.json(
        { error: 'Assessment is not adaptive' },
        { status: 400 }
      );
    }
    
    // Query for the next question based on difficulty and previously answered questions
    const nextQuestion = await prisma.question.findFirst({
      where: {
        assessment_id: assessmentId,
        difficulty_level: currentDifficulty as number,
        id: { notIn: answeredQuestionIds },
        // If knowledge area IDs are provided, filter by them
        ...(knowledgeAreaIds.length > 0 && {
          // This assumes you have a knowledgeAreaId field in your Question model
          // You may need to adjust this based on your actual schema
          knowledgeAreaId: { in: knowledgeAreaIds }
        })
      },
      orderBy: {
        // Randomize question selection
        id: 'asc'
      }
    });
    
    // If no question found at current difficulty, try adjacent difficulties
    if (!nextQuestion) {
      // Try one level easier
      const easierQuestion = currentDifficulty > 1 
        ? await prisma.question.findFirst({
            where: {
              assessment_id: assessmentId,
              difficulty_level: (currentDifficulty - 1) as number,
              id: { notIn: answeredQuestionIds },
              ...(knowledgeAreaIds.length > 0 && {
                knowledgeAreaId: { in: knowledgeAreaIds }
              })
            },
            orderBy: { id: 'asc' }
          })
        : null;
      
      // Try one level harder
      const harderQuestion = currentDifficulty < 5
        ? await prisma.question.findFirst({
            where: {
              assessment_id: assessmentId,
              difficulty_level: (currentDifficulty + 1) as number,
              id: { notIn: answeredQuestionIds },
              ...(knowledgeAreaIds.length > 0 && {
                knowledgeAreaId: { in: knowledgeAreaIds }
              })
            },
            orderBy: { id: 'asc' }
          })
        : null;
      
      // Prefer easier question if available
      const fallbackQuestion = easierQuestion || harderQuestion;
      
      if (!fallbackQuestion) {
        return NextResponse.json(
          { error: 'No more questions available' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(fallbackQuestion);
    }
    
    return NextResponse.json(nextQuestion);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch adaptive question');
  }
}

// Schema for submitting an adaptive assessment result
const adaptiveAssessmentResultSchema = z.object({
  assessmentId: z.string().uuid(),
  userId: z.string(),
  score: z.number().min(0).max(100),
  timeTaken: z.number().int().min(0),
  questionResults: z.array(z.object({
    questionId: z.string().uuid(),
    correct: z.boolean(),
    timeTaken: z.number().int().min(0).optional(),
    difficulty: z.number().int().min(1).max(5),
    knowledgeAreaId: z.string().optional(),
  })),
  knowledgeGaps: z.array(z.object({
    areaId: z.string(),
    proficiency: z.number().min(0).max(100),
  })),
});

/**
 * POST /api/assessment/adaptive
 * Submits the results of an adaptive assessment
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = adaptiveAssessmentResultSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { 
      assessmentId, 
      userId, 
      score, 
      timeTaken, 
      questionResults,
      knowledgeGaps
    } = validationResult.data;
    
    // Save assessment result
    const result = await prisma.userAssessment.create({
      data: {
        user_id: userId,
        assessment_id: assessmentId,
        score,
        completed_at: new Date(),
        answers: questionResults,
      }
    });
    
    // Update user knowledge map
    for (const gap of knowledgeGaps) {
      // Check if knowledge area exists for user
      const existingArea = await prisma.userProgress.findFirst({
        where: {
          user_id: userId,
          topic_id: gap.areaId, // Assuming topic_id corresponds to knowledge area
        }
      });
      
      if (existingArea) {
        // Update existing knowledge area
        await prisma.userProgress.update({
          where: { id: existingArea.id },
          data: {
            proficiency_level: gap.proficiency,
            last_interaction: new Date(),
          }
        });
      } else {
        // Create new knowledge area entry
        await prisma.userProgress.create({
          data: {
            user_id: userId,
            topic_id: gap.areaId,
            proficiency_level: gap.proficiency,
            last_interaction: new Date(),
            completed: false,
          }
        });
      }
    }
    
    return NextResponse.json({
      id: result.id,
      score,
      completedAt: result.completed_at,
      message: 'Assessment result saved successfully',
    });
  } catch (error) {
    return handleApiError(error, 'Failed to submit assessment result');
  }
}
