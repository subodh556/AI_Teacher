/**
 * Prisma Database Utility Functions
 * 
 * This file contains utility functions for common database operations using Prisma.
 * These functions are designed to work alongside the existing Supabase integration.
 */

import { prisma } from './prisma';

/**
 * User-related functions
 */

/**
 * Get a user by ID
 * @param userId - The user ID to look up
 * @returns The user data or null if not found
 */
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    return user;
  } catch (error) {
    console.error('Error fetching user with Prisma:', error);
    return null;
  }
}

/**
 * Create a new user
 * @param data - User data including email and name
 * @returns The created user or null if error
 */
export async function createUser(data: { email: string; name: string; }) {
  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        created_at: new Date()
      }
    });
    return user;
  } catch (error) {
    console.error('Error creating user with Prisma:', error);
    return null;
  }
}

/**
 * Update user preferences
 * @param userId - The user ID
 * @param preferences - User preferences as JSON
 * @returns The updated user or null if error
 */
export async function updateUserPreferences(userId: string, preferences: any) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { preferences }
    });
    return user;
  } catch (error) {
    console.error('Error updating user preferences with Prisma:', error);
    return null;
  }
}

/**
 * Topic-related functions
 */

/**
 * Get all topics
 * @param parentId - Optional parent ID to filter by
 * @returns Array of topics
 */
export async function getTopics(parentId?: string) {
  try {
    const topics = await prisma.topic.findMany({
      where: parentId ? { parent_id: parentId } : undefined,
      include: {
        children: true
      }
    });
    return topics;
  } catch (error) {
    console.error('Error fetching topics with Prisma:', error);
    return [];
  }
}

/**
 * Get a topic by ID
 * @param topicId - The topic ID to look up
 * @returns The topic data or null if not found
 */
export async function getTopicById(topicId: string) {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        parent: true,
        children: true
      }
    });
    return topic;
  } catch (error) {
    console.error('Error fetching topic with Prisma:', error);
    return null;
  }
}

/**
 * Content-related functions
 */

/**
 * Get content for a specific topic
 * @param topicId - The topic ID to get content for
 * @returns Array of content items
 */
export async function getContentByTopic(topicId: string) {
  try {
    const content = await prisma.content.findMany({
      where: { topic_id: topicId },
      orderBy: { difficulty_level: 'asc' }
    });
    return content;
  } catch (error) {
    console.error('Error fetching content with Prisma:', error);
    return [];
  }
}

/**
 * Assessment-related functions
 */

/**
 * Get assessments for a specific topic
 * @param topicId - The topic ID to get assessments for
 * @returns Array of assessments
 */
export async function getAssessmentsByTopic(topicId: string) {
  try {
    const assessments = await prisma.assessment.findMany({
      where: { topic_id: topicId }
    });
    return assessments;
  } catch (error) {
    console.error('Error fetching assessments with Prisma:', error);
    return [];
  }
}

/**
 * Get questions for a specific assessment
 * @param assessmentId - The assessment ID to get questions for
 * @returns Array of questions
 */
export async function getQuestionsByAssessment(assessmentId: string) {
  try {
    const questions = await prisma.question.findMany({
      where: { assessment_id: assessmentId },
      orderBy: { difficulty_level: 'asc' }
    });
    return questions;
  } catch (error) {
    console.error('Error fetching questions with Prisma:', error);
    return [];
  }
}

/**
 * User progress-related functions
 */

/**
 * Get user progress for a specific user
 * @param userId - The user ID to get progress for
 * @returns Array of user progress items with topic details
 */
export async function getUserProgress(userId: string) {
  try {
    const progress = await prisma.userProgress.findMany({
      where: { user_id: userId },
      include: { topic: true }
    });
    return progress;
  } catch (error) {
    console.error('Error fetching user progress with Prisma:', error);
    return [];
  }
}

/**
 * Update user progress for a specific topic
 * @param userId - The user ID
 * @param topicId - The topic ID
 * @param proficiencyLevel - The new proficiency level
 * @param completed - Whether the topic is completed
 * @returns The updated user progress or null if error
 */
export async function updateUserProgress(
  userId: string,
  topicId: string,
  proficiencyLevel: number,
  completed: boolean
) {
  try {
    // Check if progress record exists
    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        user_id_topic_id: {
          user_id: userId,
          topic_id: topicId
        }
      }
    });
    
    if (existingProgress) {
      // Update existing record
      return await prisma.userProgress.update({
        where: { id: existingProgress.id },
        data: {
          proficiency_level: proficiencyLevel,
          last_interaction: new Date(),
          completed
        }
      });
    } else {
      // Create new record
      return await prisma.userProgress.create({
        data: {
          user_id: userId,
          topic_id: topicId,
          proficiency_level: proficiencyLevel,
          last_interaction: new Date(),
          completed
        }
      });
    }
  } catch (error) {
    console.error('Error updating user progress with Prisma:', error);
    return null;
  }
}

/**
 * Achievement-related functions
 */

/**
 * Get user achievements
 * @param userId - The user ID to get achievements for
 * @returns Array of user achievements with achievement details
 */
export async function getUserAchievements(userId: string) {
  try {
    const achievements = await prisma.userAchievement.findMany({
      where: { user_id: userId },
      include: { achievement: true }
    });
    return achievements;
  } catch (error) {
    console.error('Error fetching user achievements with Prisma:', error);
    return [];
  }
}

/**
 * Award an achievement to a user
 * @param userId - The user ID
 * @param achievementId - The achievement ID
 * @returns The created user achievement or null if error
 */
export async function awardAchievement(userId: string, achievementId: string) {
  try {
    // Check if already awarded
    const existing = await prisma.userAchievement.findUnique({
      where: {
        user_id_achievement_id: {
          user_id: userId,
          achievement_id: achievementId
        }
      }
    });
    
    if (existing) {
      return existing;
    }
    
    return await prisma.userAchievement.create({
      data: {
        user_id: userId,
        achievement_id: achievementId,
        earned_at: new Date()
      }
    });
  } catch (error) {
    console.error('Error awarding achievement with Prisma:', error);
    return null;
  }
}

/**
 * Study plan-related functions
 */

/**
 * Get user study plan
 * @param userId - The user ID to get study plan for
 * @returns The user's study plan or null if not found
 */
export async function getUserStudyPlan(userId: string) {
  try {
    const studyPlan = await prisma.studyPlan.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
    return studyPlan;
  } catch (error) {
    console.error('Error fetching study plan with Prisma:', error);
    return null;
  }
}

/**
 * Create or update user study plan
 * @param userId - The user ID
 * @param planData - The study plan data
 * @param aiGenerated - Whether the plan was AI-generated
 * @returns The created/updated study plan or null if error
 */
export async function saveStudyPlan(
  userId: string,
  planData: any,
  aiGenerated: boolean = false
) {
  try {
    const now = new Date();
    
    // Check if plan exists
    const existingPlan = await prisma.studyPlan.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
    
    if (existingPlan) {
      // Update existing plan
      return await prisma.studyPlan.update({
        where: { id: existingPlan.id },
        data: {
          updated_at: now,
          plan_data: planData,
          ai_generated: aiGenerated
        }
      });
    } else {
      // Create new plan
      return await prisma.studyPlan.create({
        data: {
          user_id: userId,
          created_at: now,
          updated_at: now,
          plan_data: planData,
          ai_generated: aiGenerated
        }
      });
    }
  } catch (error) {
    console.error('Error saving study plan with Prisma:', error);
    return null;
  }
}
