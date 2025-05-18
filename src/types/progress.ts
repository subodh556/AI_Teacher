/**
 * Progress Tracking Types
 * 
 * This file contains TypeScript types for the progress tracking system.
 */

import { ProgressData, Achievement } from './core-components';

// User Goal Types
export interface UserGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  goalType: 'daily' | 'weekly' | 'monthly' | 'total';
  topicId?: string;
  topicName?: string;
  startDate: string;
  endDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// User Activity Types
export interface UserActivity {
  id: string;
  userId: string;
  activityType: 'lesson' | 'practice' | 'assessment' | 'quiz' | 'content' | 'other';
  activityData: Record<string, any>;
  topicId?: string;
  topicName?: string;
  duration?: number;
  createdAt: string;
}

// Progress Metric Types
export interface ProgressMetric {
  id: string;
  userId: string;
  metricType: 'daily_streak' | 'weekly_progress' | 'topic_proficiency' | 'assessment_score' | 'time_spent' | 'completion_rate';
  metricValue: number;
  metricData?: Record<string, any>;
  date: string;
}

// Progress Summary Types
export interface ProgressSummary {
  completedTopics: number;
  totalTopics: number;
  progressPercentage: number;
  averageProficiency: number;
  recentAssessments?: any[];
  recentAssessmentScore?: number;
  achievementCount: number;
  recentAchievements?: Achievement[];
  currentStreak: number;
  weeklyProgress: number;
  monthlyProgress: number;
  timeSpent: number; // in minutes
}

// Topic Progress Types
export interface TopicProgress {
  id: string;
  name: string;
  description?: string;
  proficiencyLevel: number;
  completed: boolean;
  lastInteraction: string;
  assessmentsTaken?: number;
  averageScore?: number;
}

// Progress Chart Data Types
export interface ProgressChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }[];
}

// Strengths and Weaknesses Types
export interface StrengthWeakness {
  topicId: string;
  topicName: string;
  proficiencyLevel: number;
  assessmentScore?: number;
  timeSpent?: number; // in minutes
  isStrength: boolean;
}

// Progress Export Types
export interface ProgressExport {
  userId: string;
  startDate?: string;
  endDate?: string;
  includeActivities?: boolean;
  includeAssessments?: boolean;
  includeAchievements?: boolean;
  includeMetrics?: boolean;
  format?: 'json' | 'csv';
}

// Progress Export Result Types
export interface ProgressExportResult {
  userData: {
    id: string;
    name: string;
    email: string;
  };
  summary: ProgressSummary;
  topicProgress?: TopicProgress[];
  activities?: UserActivity[];
  assessments?: any[];
  achievements?: Achievement[];
  metrics?: ProgressMetric[];
  exportDate: string;
  format: 'json' | 'csv';
}

// Progress Dashboard Enhanced Props
export interface ProgressDashboardEnhancedProps {
  progressData: ProgressData[];
  achievements?: Achievement[];
  streakCount?: number;
  completedToday?: number;
  topicProgress?: TopicProgress[];
  strengthsWeaknesses?: StrengthWeakness[];
  goals?: UserGoal[];
  recentActivities?: UserActivity[];
  className?: string;
}
