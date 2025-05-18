/**
 * AI Study Plans API Endpoints
 *
 * This file contains the API endpoints for generating personalized study plans.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  handleApiError,
  validateRequest,
  parseRequestBody
} from '@/lib/api-utils';
import { studyPlanGenerationSchema } from '@/lib/validation';
import { createStudyPlanChain } from '@/lib/langchain';
import { formatStudyPlan, extractKnowledgeGaps } from '@/lib/langchain/utils';

/**
 * POST /api/ai/study-plans
 * Generates a personalized study plan based on user data
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const validatedData = await validateRequest(body, studyPlanGenerationSchema);

    const { user_id, available_time, preferences } = validatedData;

    // Find or create the user in the database
    let user = await prisma.user.findFirst({
      where: { email: user_id } // Using email as a fallback to find the user
    });

    // If user doesn't exist, create a new user
    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            email: user_id,
            name: 'New User', // Default name
          }
        });
        console.log('Created new user:', user.id);
      } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }
    }

    // Get user progress data using the database user ID
    const userProgress = await prisma.userProgress.findMany({
      where: { user_id: user.id },
      include: {
        topic: true
      }
    });

    // Get user assessment data
    const userAssessments = await prisma.userAssessment.findMany({
      where: { user_id: user.id },
      include: {
        assessment: {
          include: {
            topic: true,
            questions: true
          }
        }
      },
      orderBy: { completed_at: 'desc' }
    });

    // Get all topics
    const topics = await prisma.topic.findMany({
      include: {
        content: {
          select: {
            id: true,
            title: true,
            content_type: true,
            difficulty_level: true
          }
        }
      }
    });

    // Format the data for the AI model
    const proficiencyLevels = userProgress.map(progress => ({
      topic_id: progress.topic_id,
      topic_name: progress.topic.name,
      proficiency_level: progress.proficiency_level
    }));

    const assessmentResults = userAssessments.map(assessment => ({
      assessment_id: assessment.assessment_id,
      topic_id: assessment.assessment.topic_id,
      topic_name: assessment.assessment.topic.name,
      score: assessment.score,
      completed_at: assessment.completed_at
    }));

    // Extract knowledge gaps
    const knowledgeGaps = extractKnowledgeGaps(
      userAssessments.map(ua => ({
        assessment_id: ua.assessment_id,
        topic_id: ua.assessment.topic_id,
        score: ua.score,
        answers: ua.answers as Record<string, any>,
        questions: (ua.assessment.questions || []).map(q => ({
          id: q.id,
          question_text: q.question_text,
          correct: (ua.answers as any)[q.id]?.correct || false,
          topic_area: q.topic_area as string | undefined
        }))
      }))
    );

    // Create the study plan chain
    const studyPlanChain = createStudyPlanChain();

    // Generate the study plan
    const studyPlanJson = await studyPlanChain.invoke({
      userId: user_id,
      proficiencyLevels: JSON.stringify(proficiencyLevels),
      preferences: JSON.stringify(preferences || {}),
      availableTime: available_time || 10,
      topics: JSON.stringify(topics.map(topic => ({
        id: topic.id,
        name: topic.name,
        description: topic.description,
        difficulty_level: topic.difficulty_level,
        knowledge_gaps: knowledgeGaps[topic.id] || []
      }))),
      assessmentResults: JSON.stringify(assessmentResults)
    });

    // Parse the study plan
    let studyPlan;
    try {
      studyPlan = JSON.parse(studyPlanJson);
    } catch (error) {
      console.error('Error parsing study plan JSON:', error);
      console.log('Raw study plan:', studyPlanJson);

      return NextResponse.json(
        { error: 'Failed to generate study plan: Invalid response format' },
        { status: 500 }
      );
    }

    // Format the study plan
    const formattedStudyPlan = formatStudyPlan(studyPlan);

    // Save the study plan to the database
    const savedStudyPlan = await prisma.studyPlan.create({
      data: {
        user_id: user.id,
        plan_data: formattedStudyPlan,
        ai_generated: true
      }
    });

    return NextResponse.json({
      id: savedStudyPlan.id,
      study_plan: formattedStudyPlan,
      created_at: savedStudyPlan.created_at
    });
  } catch (error) {
    return handleApiError(error, 'Failed to generate study plan');
  }
}

/**
 * GET /api/ai/study-plans
 * Returns study plans for a user
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: user_id' },
        { status: 400 }
      );
    }

    // Find or create the user in the database
    let user = await prisma.user.findFirst({
      where: { email: userId }
    });

    // If user doesn't exist, create a new user
    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            email: userId,
            name: 'New User', // Default name
          }
        });
        console.log('Created new user:', user.id);
      } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }
    }

    const studyPlans = await prisma.studyPlan.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(studyPlans);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch study plans');
  }
}
