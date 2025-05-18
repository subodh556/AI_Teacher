/**
 * Gamification Utility Functions
 * 
 * This file contains utility functions for the gamification system,
 * including streak tracking, badge awarding, and level progression.
 */

import { LevelInfo, Badge, BadgeTier } from '@/types/gamification';

/**
 * Get level information based on level number
 * @param level - The level number
 * @returns Level information including title and experience requirements
 */
export function getLevelInfo(level: number): LevelInfo {
  const levelTitles: Record<number, string> = {
    1: 'Novice',
    2: 'Apprentice',
    3: 'Student',
    4: 'Scholar',
    5: 'Adept',
    6: 'Expert',
    7: 'Master',
    8: 'Grandmaster',
    9: 'Sage',
    10: 'Enlightened',
  };

  // Calculate experience requirements using a common RPG formula
  const baseExp = 100;
  const minExperience = level === 1 ? 0 : calculateTotalExpForLevel(level - 1);
  const maxExperience = calculateTotalExpForLevel(level);

  return {
    level,
    title: levelTitles[level] || `Level ${level}`,
    minExperience,
    maxExperience,
    benefits: getLevelBenefits(level),
  };
}

/**
 * Calculate total experience required to reach a specific level
 * @param level - The target level
 * @returns Total experience required
 */
export function calculateTotalExpForLevel(level: number): number {
  const baseExp = 100;
  let totalExp = 0;
  
  for (let i = 1; i <= level; i++) {
    totalExp += Math.round(baseExp * Math.pow(i, 1.5));
  }
  
  return totalExp;
}

/**
 * Get benefits for a specific level
 * @param level - The level number
 * @returns Array of benefit descriptions
 */
function getLevelBenefits(level: number): string[] {
  const benefits: Record<number, string[]> = {
    1: ['Access to basic learning content'],
    2: ['Unlock daily challenges'],
    3: ['Access to intermediate learning content'],
    5: ['Unlock advanced learning content', 'Access to special coding exercises'],
    7: ['Unlock expert challenges', 'Access to community forums'],
    10: ['Unlock mentor status', 'Create and share custom learning paths'],
  };
  
  // Return benefits for the current level or an empty array if none defined
  return benefits[level] || [];
}

/**
 * Get color for badge tier
 * @param tier - The badge tier
 * @returns CSS color class
 */
export function getBadgeTierColor(tier: BadgeTier): string {
  switch (tier) {
    case 'bronze':
      return 'text-amber-600';
    case 'silver':
      return 'text-slate-400';
    case 'gold':
      return 'text-yellow-400';
    case 'platinum':
      return 'text-cyan-300';
    default:
      return 'text-blue-500';
  }
}

/**
 * Get background color for badge tier
 * @param tier - The badge tier
 * @returns CSS background color class
 */
export function getBadgeTierBgColor(tier: BadgeTier): string {
  switch (tier) {
    case 'bronze':
      return 'bg-amber-600/10';
    case 'silver':
      return 'bg-slate-400/10';
    case 'gold':
      return 'bg-yellow-400/10';
    case 'platinum':
      return 'bg-cyan-300/10';
    default:
      return 'bg-blue-500/10';
  }
}

/**
 * Format date for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Check if a streak is active (last activity was today or yesterday)
 * @param lastActiveDate - ISO date string of last activity
 * @returns Boolean indicating if streak is active
 */
export function isStreakActive(lastActiveDate: string): boolean {
  const lastActive = new Date(lastActiveDate);
  const today = new Date();
  
  // Reset time components for date comparison
  lastActive.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = today.getTime() - lastActive.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Streak is active if last activity was today or yesterday
  return diffDays <= 1;
}

/**
 * Calculate experience points for an activity
 * @param activityType - Type of activity
 * @param params - Additional parameters for calculation
 * @returns Experience points earned
 */
export function calculateExperiencePoints(
  activityType: string,
  params: Record<string, any> = {}
): number {
  switch (activityType) {
    case 'lesson_completion':
      return 50 + (params.difficulty || 1) * 10;
      
    case 'assessment_completion':
      return 30 + Math.floor((params.score || 0) / 10) * 5;
      
    case 'coding_exercise':
      return 40 + (params.difficulty || 1) * 15;
      
    case 'streak_bonus':
      return 20 * (params.streakDays || 1);
      
    case 'badge_earned':
      const tierMultiplier = {
        bronze: 1,
        silver: 2,
        gold: 4,
        platinum: 10,
      };
      return 50 * (tierMultiplier[params.tier as BadgeTier] || 1);
      
    default:
      return 10;
  }
}
