/**
 * Gamification System Types
 * 
 * This file contains TypeScript types for the gamification system,
 * including streaks, badges, and level progression.
 */

// Streak Types
export interface UserStreak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActive: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

// Level Types
export interface UserLevel {
  id: string;
  userId: string;
  currentLevel: number;
  experience: number;
  nextLevelExp: number;
  createdAt: string;
  updatedAt: string;
}

// Badge Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string; // Lucide icon name
  category: BadgeCategory;
  tier: BadgeTier;
  criteria: BadgeCriteria;
  earnedAt?: string; // ISO date string if earned, undefined if not
}

export type BadgeCategory = 
  | 'learning' 
  | 'assessment' 
  | 'coding' 
  | 'streak' 
  | 'achievement';

export type BadgeTier = 
  | 'bronze' 
  | 'silver' 
  | 'gold' 
  | 'platinum';

export interface BadgeCriteria {
  type: BadgeCriteriaType;
  threshold: number;
  additionalParams?: Record<string, any>;
}

export type BadgeCriteriaType = 
  | 'lesson_completion' 
  | 'assessment_score' 
  | 'coding_exercises' 
  | 'streak_days' 
  | 'perfect_scores'
  | 'topic_mastery';

// Level Progression Types
export interface LevelInfo {
  level: number;
  title: string;
  minExperience: number;
  maxExperience: number;
  benefits?: string[];
}

// Experience Points Types
export interface ExperiencePoints {
  amount: number;
  source: ExperienceSource;
  timestamp: string; // ISO date string
  description: string;
}

export type ExperienceSource = 
  | 'lesson_completion' 
  | 'assessment_completion' 
  | 'coding_exercise' 
  | 'streak_bonus' 
  | 'achievement_earned';

// Gamification Dashboard Props
export interface GamificationDashboardProps {
  streak?: UserStreak;
  level?: UserLevel;
  badges?: Badge[];
  recentExperience?: ExperiencePoints[];
  className?: string;
}

// Streak Tracker Props
export interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
  lastActive: string; // ISO date string
  className?: string;
}

// Badge Showcase Props
export interface BadgeShowcaseProps {
  badges: Badge[];
  className?: string;
}

// Level Progression Props
export interface LevelProgressionProps {
  currentLevel: number;
  experience: number;
  nextLevelExp: number;
  className?: string;
}
