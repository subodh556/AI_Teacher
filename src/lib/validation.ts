/**
 * Validation Schemas
 *
 * This file contains Zod schemas for validating API requests.
 */

import { z } from 'zod';

// User schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  created_at: z.string().datetime().optional(),
  last_login: z.string().datetime().nullable().optional(),
  preferences: z.record(z.any()).optional(),
});

export const userCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  preferences: z.record(z.any()).optional(),
});

// Topic schemas
export const topicSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  parent_id: z.string().uuid().nullable().optional(),
  difficulty_level: z.number().int().min(1).max(5),
});

export const topicCreateSchema = topicSchema.omit({ id: true });
export const topicUpdateSchema = topicSchema.partial().omit({ id: true });

// Content schemas
export const contentSchema = z.object({
  id: z.string().uuid().optional(),
  topic_id: z.string().uuid(),
  title: z.string().min(1),
  content_type: z.enum(['text', 'video', 'interactive']),
  content_data: z.record(z.any()),
  difficulty_level: z.number().int().min(1).max(5),
});

export const contentCreateSchema = contentSchema.omit({ id: true });
export const contentUpdateSchema = contentSchema.partial().omit({ id: true });

// Assessment schemas
export const assessmentSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  topic_id: z.string().uuid(),
  adaptive: z.boolean().default(false),
});

export const assessmentCreateSchema = assessmentSchema.omit({ id: true });
export const assessmentUpdateSchema = assessmentSchema.partial().omit({ id: true });

// Question schemas
export const questionSchema = z.object({
  id: z.string().uuid().optional(),
  assessment_id: z.string().uuid(),
  question_text: z.string().min(1),
  question_type: z.enum(['multiple-choice', 'coding', 'short-answer']),
  options: z.array(z.object({
    id: z.string(),
    text: z.string(),
  })).optional(),
  correct_answer: z.string(),
  difficulty_level: z.number().int().min(1).max(5),
  explanation: z.string(),
});

export const questionCreateSchema = questionSchema.omit({ id: true });
export const questionUpdateSchema = questionSchema.partial().omit({ id: true });

// User Progress schemas
export const userProgressSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  topic_id: z.string().uuid(),
  proficiency_level: z.number().int().min(0).max(100),
  last_interaction: z.string().datetime().optional(),
  completed: z.boolean().default(false),
});

export const userProgressCreateSchema = userProgressSchema.omit({ id: true });
export const userProgressUpdateSchema = userProgressSchema.partial().omit({ id: true });

// User Assessment schemas
export const userAssessmentSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  assessment_id: z.string().uuid(),
  score: z.number().min(0).max(100),
  completed_at: z.string().datetime().optional(),
  answers: z.record(z.any()),
});

export const userAssessmentCreateSchema = userAssessmentSchema.omit({ id: true });
export const userAssessmentUpdateSchema = userAssessmentSchema.partial().omit({ id: true });

// Achievement schemas
export const achievementSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  criteria: z.record(z.any()),
  icon_url: z.string().url().optional(),
});

export const achievementCreateSchema = achievementSchema.omit({ id: true });
export const achievementUpdateSchema = achievementSchema.partial().omit({ id: true });

// User Achievement schemas
export const userAchievementSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  achievement_id: z.string().uuid(),
  earned_at: z.string().datetime().optional(),
});

export const userAchievementCreateSchema = userAchievementSchema.omit({ id: true });

// Study Plan schemas
export const studyPlanSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  plan_data: z.record(z.any()),
  ai_generated: z.boolean().default(false),
});

export const studyPlanCreateSchema = studyPlanSchema.omit({ id: true });
export const studyPlanUpdateSchema = studyPlanSchema.partial().omit({ id: true });

// AI Recommendation schemas
export const aiRecommendationSchema = z.object({
  user_id: z.string(), // Changed from uuid to string to accept Clerk user IDs
  topic_id: z.string().optional(), // Changed from uuid to string
  context: z.record(z.any()).optional(),
});

// AI Explanation schemas
export const aiExplanationSchema = z.object({
  user_id: z.string(), // Changed from uuid to string to accept Clerk user IDs
  content_id: z.string().optional(), // Changed from uuid to string
  question_id: z.string().optional(), // Changed from uuid to string
  query: z.string().min(1),
});

// User Streak schemas
export const userStreakSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string(), // Changed from uuid to string to accept Clerk user IDs
  current_streak: z.number().int().min(0),
  longest_streak: z.number().int().min(0).optional(),
  last_active: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const userStreakCreateSchema = userStreakSchema.omit({ id: true });
export const userStreakUpdateSchema = userStreakSchema.partial().omit({ id: true });

// User Level schemas
export const userLevelSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string(), // Changed from uuid to string to accept Clerk user IDs
  current_level: z.number().int().min(1),
  experience: z.number().int().min(0),
  next_level_exp: z.number().int().min(1),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const userLevelCreateSchema = userLevelSchema.omit({ id: true });
export const userLevelUpdateSchema = userLevelSchema.partial().omit({ id: true });

// Study Plan Generation schemas
export const studyPlanGenerationSchema = z.object({
  user_id: z.string(), // Changed from uuid to string to accept Clerk user IDs
  available_time: z.number().int().min(1).max(40).optional(),
  preferences: z.record(z.any()).optional(),
});

// Quiz Generation schemas
export const quizGenerationSchema = z.object({
  user_id: z.string(), // Changed from uuid to string to accept Clerk user IDs
  topic_id: z.string(), // Changed from uuid to string to accept mock topic IDs
  question_types: z.array(z.enum(['multiple-choice', 'short-answer', 'coding'])).optional(),
  number_of_questions: z.number().int().min(1).max(20).optional(),
  difficulty_level: z.number().int().min(1).max(5).nullable().optional(),
});

// User Goal schemas
export const userGoalSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  target_value: z.number().int().min(1),
  current_value: z.number().int().min(0).optional(),
  goal_type: z.enum(['daily', 'weekly', 'monthly', 'total']),
  topic_id: z.string().uuid().nullable().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().nullable().optional(),
  completed: z.boolean().optional(),
});

export const userGoalCreateSchema = userGoalSchema.omit({ id: true });
export const userGoalUpdateSchema = userGoalSchema.partial().omit({ id: true, user_id: true });

// User Activity schemas
export const userActivitySchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  activity_type: z.enum(['lesson', 'practice', 'assessment', 'quiz', 'content', 'other']),
  activity_data: z.record(z.any()),
  topic_id: z.string().uuid().nullable().optional(),
  duration: z.number().int().min(0).optional(),
  created_at: z.string().datetime().optional(),
});

export const userActivityCreateSchema = userActivitySchema.omit({ id: true });

// Progress Metric schemas
export const progressMetricSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  metric_type: z.enum([
    'daily_streak',
    'weekly_progress',
    'topic_proficiency',
    'assessment_score',
    'time_spent',
    'completion_rate'
  ]),
  metric_value: z.number(),
  metric_data: z.record(z.any()).optional(),
  date: z.string().datetime().optional(),
});

export const progressMetricCreateSchema = progressMetricSchema.omit({ id: true });
export const progressMetricUpdateSchema = progressMetricSchema.partial().omit({ id: true, user_id: true });

// Progress Export schemas
export const progressExportSchema = z.object({
  user_id: z.string().uuid(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  include_activities: z.boolean().optional(),
  include_assessments: z.boolean().optional(),
  include_achievements: z.boolean().optional(),
  include_metrics: z.boolean().optional(),
  format: z.enum(['json', 'csv']).optional(),
});
