/**
 * Assessment API Endpoints for a specific assessment
 *
 * This file contains the API endpoints for operations on a specific assessment.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-utils';

/**
 * GET /api/assessment/[id]
 * Returns a specific assessment with its questions
 */
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        topic: {
          select: {
            name: true,
            description: true,
            difficulty_level: true
          }
        },
        questions: {
          orderBy: { difficulty_level: 'asc' }
        }
      }
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(assessment);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch assessment');
  }
}

/**
 * POST /api/assessment/[id]/submit
 * Submits an assessment attempt
 */
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const body = await request.json();

    // Validate required fields
    if (!body.userId || !body.answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { userId, answers } = body;

    // Get the assessment and its questions
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        questions: true
      }
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = assessment.questions.length;

    for (const question of assessment.questions) {
      const userAnswer = answers[question.id];
      if (userAnswer && userAnswer === question.correct_answer) {
        correctAnswers++;
      }
    }

    const score = totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

    // Save the assessment result
    const result = await prisma.userAssessment.create({
      data: {
        user_id: userId,
        assessment_id: id,
        score,
        completed_at: new Date(),
        answers: answers
      }
    });

    // Update user progress for the topic
    await prisma.userProgress.upsert({
      where: {
        user_id_topic_id: {
          user_id: userId,
          topic_id: assessment.topic_id
        }
      },
      update: {
        proficiency_level: score,
        last_interaction: new Date(),
        completed: score >= 70 // Mark as completed if score is 70% or higher
      },
      create: {
        user_id: userId,
        topic_id: assessment.topic_id,
        proficiency_level: score,
        last_interaction: new Date(),
        completed: score >= 70
      }
    });

    return NextResponse.json({
      id: result.id,
      score,
      feedback: score > 80
        ? 'Excellent work!'
        : score > 60
        ? 'Good job, but there\'s room for improvement.'
        : 'You should review the material and try again.',
      completedAt: result.completed_at
    });
  } catch (error) {
    return handleApiError(error, 'Failed to submit assessment');
  }
}