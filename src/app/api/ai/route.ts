/**
 * AI API Endpoints
 * 
 * This file contains the API endpoints for AI-powered recommendations.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  handleApiError, 
  validateRequest, 
  extractQueryParams,
  parseRequestBody
} from '@/lib/api-utils';
import { aiRecommendationSchema } from '@/lib/validation';

/**
 * POST /api/ai/recommendations
 * Generates AI-powered learning recommendations
 */
export async function recommendations(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const validatedData = await validateRequest(body, aiRecommendationSchema);
    
    const { user_id, topic_id } = validatedData;
    
    // Get user progress data
    const userProgress = await prisma.userProgress.findMany({
      where: { user_id },
      include: {
        topic: true
      }
    });
    
    // Get user assessment data
    const userAssessments = await prisma.userAssessment.findMany({
      where: { user_id },
      include: {
        assessment: {
          include: {
            topic: true
          }
        }
      },
      orderBy: { completed_at: 'desc' }
    });
    
    // Get all topics
    const allTopics = await prisma.topic.findMany({
      include: {
        content: {
          select: {
            id: true,
            title: true,
            content_type: true,
            difficulty_level: true
          }
        },
        assessments: {
          select: {
            id: true,
            title: true,
            adaptive: true
          }
        }
      }
    });
    
    // Filter topics if topic_id is provided
    const topics = topic_id 
      ? allTopics.filter(t => t.id === topic_id)
      : allTopics;
    
    // Calculate recommendations
    const recommendations = [];
    
    for (const topic of topics) {
      // Check if user has progress for this topic
      const progress = userProgress.find(p => p.topic_id === topic.id);
      
      // If topic is completed, skip unless it's the specifically requested topic
      if (progress?.completed && topic.id !== topic_id) {
        continue;
      }
      
      // Get user's proficiency level for this topic
      const proficiencyLevel = progress?.proficiency_level || 0;
      
      // Find appropriate content based on proficiency
      const recommendedContent = topic.content
        .filter(c => {
          // For beginners (0-30), recommend easy content
          if (proficiencyLevel < 30 && c.difficulty_level <= 2) return true;
          
          // For intermediate (30-70), recommend medium content
          if (proficiencyLevel >= 30 && proficiencyLevel < 70 && c.difficulty_level === 3) return true;
          
          // For advanced (70+), recommend challenging content
          if (proficiencyLevel >= 70 && c.difficulty_level >= 4) return true;
          
          return false;
        })
        .sort((a, b) => a.difficulty_level - b.difficulty_level);
      
      // Find appropriate assessments
      const recommendedAssessments = topic.assessments
        .filter(a => {
          // If user has never taken an assessment for this topic, recommend it
          const takenAssessment = userAssessments.find(ua => ua.assessment.topic_id === topic.id);
          if (!takenAssessment) return true;
          
          // If user has taken an assessment but scored poorly, recommend it again
          if (takenAssessment.score < 70) return true;
          
          // If it's an adaptive assessment, always recommend it
          if (a.adaptive) return true;
          
          return false;
        });
      
      if (recommendedContent.length > 0 || recommendedAssessments.length > 0) {
        recommendations.push({
          topic: {
            id: topic.id,
            name: topic.name,
            description: topic.description,
            difficulty_level: topic.difficulty_level
          },
          content: recommendedContent.slice(0, 3), // Limit to 3 content items
          assessments: recommendedAssessments.slice(0, 2), // Limit to 2 assessments
          currentProficiency: proficiencyLevel
        });
      }
    }
    
    // Sort recommendations by priority
    recommendations.sort((a, b) => {
      // Prioritize topics with lower proficiency
      return a.currentProficiency - b.currentProficiency;
    });
    
    return NextResponse.json({
      recommendations: recommendations.slice(0, 5), // Limit to 5 recommendations
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return handleApiError(error, 'Failed to generate recommendations');
  }
}
