/**
 * Progress Metrics API Endpoints
 *
 * This file contains the API endpoints for progress metrics in the progress tracking system.
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
  progressMetricCreateSchema,
  progressMetricUpdateSchema
} from '@/lib/validation';

/**
 * Helper function to get progress metrics for a user
 */
async function getMetrics(request: Request) {
  try {
    const params = extractQueryParams(request, ['user_id', 'metric_type', 'start_date', 'end_date']);
    const { user_id, metric_type, start_date, end_date } = params;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Build the where clause
    const where: any = {
      user_id: user_id as string
    };

    if (metric_type) {
      where.metric_type = metric_type as string;
    }

    if (start_date || end_date) {
      where.date = {};

      if (start_date) {
        where.date.gte = new Date(start_date as string);
      }

      if (end_date) {
        where.date.lte = new Date(end_date as string);
      }
    }

    const metrics = await prisma.progressMetric.findMany({
      where,
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(metrics);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch progress metrics');
  }
}

/**
 * POST /api/progress/metrics
 * Creates a new progress metric
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const validatedData = await validateRequest(body, progressMetricCreateSchema);

    const metric = await prisma.progressMetric.create({
      data: {
        ...validatedData,
        date: validatedData.date ? new Date(validatedData.date) : new Date()
      }
    });

    return NextResponse.json(metric, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create progress metric');
  }
}

/**
 * Helper function to get a summary of progress metrics for a user
 */
async function getMetricsSummary(request: Request) {
  try {
    const params = extractQueryParams(request, ['user_id']);
    const { user_id } = params;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get the latest metrics for each metric type
    const latestMetrics = await prisma.$queryRaw`
      SELECT DISTINCT ON (metric_type) *
      FROM "ProgressMetric"
      WHERE user_id = ${user_id as string}
      ORDER BY metric_type, date DESC
    `;

    // Get metrics for time-based tracking (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const timeSeriesMetrics = await prisma.progressMetric.findMany({
      where: {
        user_id: user_id as string,
        date: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: { date: 'asc' }
    });

    // Group time series metrics by type
    const timeSeriesData: Record<string, any[]> = {};
    timeSeriesMetrics.forEach(metric => {
      if (!timeSeriesData[metric.metric_type]) {
        timeSeriesData[metric.metric_type] = [];
      }
      timeSeriesData[metric.metric_type].push({
        date: metric.date,
        value: metric.metric_value,
        data: metric.metric_data
      });
    });

    return NextResponse.json({
      latestMetrics,
      timeSeriesData
    });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch progress metrics summary');
  }
}

/**
 * Helper function to get strengths and weaknesses for a user
 */
async function getStrengthsWeaknesses(request: Request) {
  try {
    const params = extractQueryParams(request, ['user_id']);
    const { user_id } = params;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user progress across all topics
    const topicProgress = await prisma.userProgress.findMany({
      where: { user_id: user_id as string },
      include: {
        topic: {
          select: {
            name: true,
            description: true
          }
        }
      }
    });

    // Get user assessment results
    const assessmentResults = await prisma.userAssessment.findMany({
      where: { user_id: user_id as string },
      include: {
        assessment: {
          select: {
            topic_id: true
          }
        }
      }
    });

    // Calculate strengths and weaknesses
    const strengths = [];
    const weaknesses = [];

    // Group assessment results by topic
    const assessmentsByTopic: Record<string, number[]> = {};
    assessmentResults.forEach(result => {
      const topicId = result.assessment.topic_id;
      if (!assessmentsByTopic[topicId]) {
        assessmentsByTopic[topicId] = [];
      }
      assessmentsByTopic[topicId].push(result.score);
    });

    // Analyze each topic
    for (const progress of topicProgress) {
      const topicAssessments = assessmentsByTopic[progress.topic_id] || [];
      const avgScore = topicAssessments.length > 0
        ? topicAssessments.reduce((sum, score) => sum + score, 0) / topicAssessments.length
        : null;

      const item = {
        topicId: progress.topic_id,
        topicName: progress.topic.name,
        proficiencyLevel: progress.proficiency_level,
        assessmentScore: avgScore,
        completed: progress.completed,
        lastInteraction: progress.last_interaction
      };

      // Determine if this is a strength or weakness
      if (progress.proficiency_level >= 70 || (avgScore !== null && avgScore >= 80)) {
        strengths.push({ ...item, isStrength: true });
      } else if (progress.proficiency_level < 40 || (avgScore !== null && avgScore < 60)) {
        weaknesses.push({ ...item, isStrength: false });
      }
    }

    // Sort strengths and weaknesses
    strengths.sort((a, b) => b.proficiencyLevel - a.proficiencyLevel);
    weaknesses.sort((a, b) => a.proficiencyLevel - b.proficiencyLevel);

    return NextResponse.json({
      strengths: strengths.slice(0, 5), // Top 5 strengths
      weaknesses: weaknesses.slice(0, 5) // Top 5 weaknesses
    });
  } catch (error) {
    return handleApiError(error, 'Failed to fetch strengths and weaknesses');
  }
}

/**
 * GET handler for all metrics endpoints
 */
export async function GET(request: Request) {
  // Check which endpoint is being requested
  const url = new URL(request.url);

  if (url.pathname.endsWith('/summary')) {
    return getMetricsSummary(request);
  }

  if (url.pathname.endsWith('/strengths-weaknesses')) {
    return getStrengthsWeaknesses(request);
  }

  // Default metrics endpoint
  return getMetrics(request);
}
