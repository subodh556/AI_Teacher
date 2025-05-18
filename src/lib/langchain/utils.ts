/**
 * LangChain Utility Functions
 * 
 * This file contains utility functions for LangChain integration.
 */

import { generateWithGemini } from './gemini';
import { getCachedResponse, cacheModelResponse, optimizePrompt } from './cache';

/**
 * Generates a response with caching
 * @param prompt - The prompt to send to the model
 * @param options - Optional generation options
 * @returns The generated or cached response
 */
export async function generateWithCache(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxOutputTokens?: number;
    systemPrompt?: string;
    cacheTtl?: number;
    skipCache?: boolean;
  }
): Promise<string> {
  const model = options?.model || 'gemini-pro';
  
  // Check cache first if not skipping
  if (!options?.skipCache) {
    const cachedResponse = getCachedResponse(model, prompt, options);
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  
  // Optimize the prompt
  const optimizedPrompt = optimizePrompt(prompt);
  
  // Generate a new response
  const response = await generateWithGemini(optimizedPrompt, {
    temperature: options?.temperature,
    maxOutputTokens: options?.maxOutputTokens,
    systemPrompt: options?.systemPrompt
  });
  
  // Cache the response if not skipping
  if (!options?.skipCache) {
    cacheModelResponse(
      model,
      prompt,
      response,
      options,
      options?.cacheTtl
    );
  }
  
  return response;
}

/**
 * Extracts knowledge gaps from assessment results
 * @param assessmentResults - Array of assessment results
 * @returns Object mapping topic IDs to knowledge gap descriptions
 */
export function extractKnowledgeGaps(
  assessmentResults: Array<{
    assessment_id: string;
    topic_id: string;
    score: number;
    answers: Record<string, any>;
    questions: Array<{
      id: string;
      question_text: string;
      correct: boolean;
      topic_area?: string;
    }>;
  }>
): Record<string, string[]> {
  const knowledgeGaps: Record<string, string[]> = {};
  
  for (const result of assessmentResults) {
    if (result.score >= 80) {
      // No significant knowledge gaps if score is high
      continue;
    }
    
    const topicGaps: string[] = [];
    
    // Group incorrect answers by topic area
    const incorrectByArea: Record<string, number> = {};
    const totalByArea: Record<string, number> = {};
    
    for (const question of result.questions) {
      const area = question.topic_area || 'general';
      
      totalByArea[area] = (totalByArea[area] || 0) + 1;
      
      if (!question.correct) {
        incorrectByArea[area] = (incorrectByArea[area] || 0) + 1;
      }
    }
    
    // Identify areas with high error rates
    for (const area in incorrectByArea) {
      const errorRate = incorrectByArea[area] / totalByArea[area];
      
      if (errorRate >= 0.5) {
        topicGaps.push(`${area} (${Math.round(errorRate * 100)}% error rate)`);
      }
    }
    
    if (topicGaps.length > 0) {
      knowledgeGaps[result.topic_id] = topicGaps;
    }
  }
  
  return knowledgeGaps;
}

/**
 * Determines the appropriate difficulty level for content based on user proficiency
 * @param proficiencyLevel - The user's proficiency level (0-100)
 * @returns The recommended difficulty level (1-5)
 */
export function getDifficultyLevelForUser(proficiencyLevel: number): number {
  if (proficiencyLevel < 20) return 1; // Very easy
  if (proficiencyLevel < 40) return 2; // Easy
  if (proficiencyLevel < 60) return 3; // Medium
  if (proficiencyLevel < 80) return 4; // Hard
  return 5; // Very hard
}

/**
 * Formats a study plan for display
 * @param studyPlan - The raw study plan data
 * @returns Formatted study plan with additional metadata
 */
export function formatStudyPlan(studyPlan: any): any {
  // Calculate total study time
  let totalMinutes = 0;
  
  for (const day of studyPlan.weeklyPlan) {
    for (const topic of day.topics) {
      totalMinutes += topic.durationMinutes;
    }
  }
  
  // Format the study plan with additional metadata
  return {
    ...studyPlan,
    metadata: {
      totalStudyTimeMinutes: totalMinutes,
      totalStudyTimeHours: Math.round(totalMinutes / 60 * 10) / 10,
      averageDailyTimeMinutes: Math.round(totalMinutes / studyPlan.weeklyPlan.length),
      topicCount: studyPlan.weeklyPlan.reduce((count, day) => count + day.topics.length, 0)
    }
  };
}
