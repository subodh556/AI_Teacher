import { supabase } from './supabase';
import { Database } from '@/types/supabase';

/**
 * Utility functions for database operations
 */

/**
 * Get a user by ID
 * @param userId - The user ID to look up
 * @returns The user data or null if not found
 */
export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

/**
 * Get all topics
 * @param parentId - Optional parent ID to filter by
 * @returns Array of topics
 */
export async function getTopics(parentId?: string) {
  let query = supabase.from('Topics').select('*');
  
  if (parentId) {
    query = query.eq('parent_id', parentId);
  }
  
  const { data, error } = await query;

  if (error) {
    console.error('Error fetching topics:', error);
    return [];
  }

  return data;
}

/**
 * Get content for a specific topic
 * @param topicId - The topic ID to get content for
 * @returns Array of content items
 */
export async function getContentByTopic(topicId: string) {
  const { data, error } = await supabase
    .from('Content')
    .select('*')
    .eq('topic_id', topicId);

  if (error) {
    console.error('Error fetching content:', error);
    return [];
  }

  return data;
}

/**
 * Get assessments for a specific topic
 * @param topicId - The topic ID to get assessments for
 * @returns Array of assessments
 */
export async function getAssessmentsByTopic(topicId: string) {
  const { data, error } = await supabase
    .from('Assessments')
    .select('*')
    .eq('topic_id', topicId);

  if (error) {
    console.error('Error fetching assessments:', error);
    return [];
  }

  return data;
}

/**
 * Get questions for a specific assessment
 * @param assessmentId - The assessment ID to get questions for
 * @returns Array of questions
 */
export async function getQuestionsByAssessment(assessmentId: string) {
  const { data, error } = await supabase
    .from('Questions')
    .select('*')
    .eq('assessment_id', assessmentId);

  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }

  return data;
}

/**
 * Get user progress for a specific user
 * @param userId - The user ID to get progress for
 * @returns Array of user progress items
 */
export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('UserProgress')
    .select('*, Topics(*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }

  return data;
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
  const now = new Date().toISOString();
  
  // Check if progress record exists
  const { data: existingProgress } = await supabase
    .from('UserProgress')
    .select('id')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .single();
  
  if (existingProgress) {
    // Update existing record
    const { data, error } = await supabase
      .from('UserProgress')
      .update({
        proficiency_level: proficiencyLevel,
        last_interaction: now,
        completed
      })
      .eq('id', existingProgress.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user progress:', error);
      return null;
    }
    
    return data;
  } else {
    // Create new record
    const { data, error } = await supabase
      .from('UserProgress')
      .insert({
        user_id: userId,
        topic_id: topicId,
        proficiency_level: proficiencyLevel,
        last_interaction: now,
        completed
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user progress:', error);
      return null;
    }
    
    return data;
  }
}

/**
 * Get user achievements
 * @param userId - The user ID to get achievements for
 * @returns Array of user achievements with achievement details
 */
export async function getUserAchievements(userId: string) {
  const { data, error } = await supabase
    .from('UserAchievements')
    .select('*, Achievements(*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user achievements:', error);
    return [];
  }

  return data;
}

/**
 * Get user assessment results
 * @param userId - The user ID to get assessment results for
 * @returns Array of user assessment results
 */
export async function getUserAssessments(userId: string) {
  const { data, error } = await supabase
    .from('UserAssessments')
    .select('*, Assessments(*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user assessments:', error);
    return [];
  }

  return data;
}

/**
 * Save assessment result
 * @param userId - The user ID
 * @param assessmentId - The assessment ID
 * @param score - The score achieved
 * @param answers - The answers provided
 * @returns The saved assessment result or null if error
 */
export async function saveAssessmentResult(
  userId: string,
  assessmentId: string,
  score: number,
  answers: any
) {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('UserAssessments')
    .insert({
      user_id: userId,
      assessment_id: assessmentId,
      score,
      completed_at: now,
      answers
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error saving assessment result:', error);
    return null;
  }
  
  return data;
}

/**
 * Get user study plan
 * @param userId - The user ID to get study plan for
 * @returns The user's study plan or null if not found
 */
export async function getUserStudyPlan(userId: string) {
  const { data, error } = await supabase
    .from('StudyPlans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No study plan found
      return null;
    }
    console.error('Error fetching study plan:', error);
    return null;
  }

  return data;
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
  const now = new Date().toISOString();
  
  // Check if plan exists
  const { data: existingPlan } = await supabase
    .from('StudyPlans')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (existingPlan) {
    // Update existing plan
    const { data, error } = await supabase
      .from('StudyPlans')
      .update({
        updated_at: now,
        plan_data: planData,
        ai_generated: aiGenerated
      })
      .eq('id', existingPlan.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating study plan:', error);
      return null;
    }
    
    return data;
  } else {
    // Create new plan
    const { data, error } = await supabase
      .from('StudyPlans')
      .insert({
        user_id: userId,
        created_at: now,
        updated_at: now,
        plan_data: planData,
        ai_generated: aiGenerated
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating study plan:', error);
      return null;
    }
    
    return data;
  }
}
