"use client";

import { useState, useEffect } from "react";
import { Award, Calendar, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { GamificationDashboardProps, Badge, UserStreak, UserLevel } from "@/types/gamification";
import { StreakTracker } from "./StreakTracker";
import { BadgeShowcase } from "./BadgeShowcase";
import { LevelProgression } from "./LevelProgression";

// Default values for testing
const defaultStreak: UserStreak = {
  id: "1",
  userId: "1",
  currentStreak: 5,
  longestStreak: 12,
  lastActive: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultLevel: UserLevel = {
  id: "1",
  userId: "1",
  currentLevel: 3,
  experience: 75,
  nextLevelExp: 200,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultBadges: Badge[] = [
  {
    id: "1",
    name: "First Steps",
    description: "Complete your first lesson",
    iconName: "award",
    category: "learning",
    tier: "bronze",
    criteria: { type: "lesson_completion", threshold: 1 },
    earnedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Code Ninja",
    description: "Complete 10 coding exercises",
    iconName: "code",
    category: "coding",
    tier: "silver",
    criteria: { type: "coding_exercises", threshold: 10 },
    earnedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Perfect Score",
    description: "Get 100% on an assessment",
    iconName: "check-circle",
    category: "assessment",
    tier: "gold",
    criteria: { type: "assessment_score", threshold: 100 },
    earnedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Algorithm Master",
    description: "Complete all algorithm lessons",
    iconName: "cpu",
    category: "learning",
    tier: "gold",
    criteria: { type: "topic_mastery", threshold: 1 },
  },
  {
    id: "5",
    name: "30-Day Streak",
    description: "Learn for 30 consecutive days",
    iconName: "calendar",
    category: "streak",
    tier: "platinum",
    criteria: { type: "streak_days", threshold: 30 },
  },
  {
    id: "6",
    name: "Quick Learner",
    description: "Complete 5 lessons in a day",
    iconName: "zap",
    category: "learning",
    tier: "bronze",
    criteria: { type: "lesson_completion", threshold: 5 },
  },
];

export function GamificationDashboard({
  streak = defaultStreak,
  level = defaultLevel,
  badges = defaultBadges,
  recentExperience = [],
  className,
}: GamificationDashboardProps) {
  const [mounted, setMounted] = useState(false);

  // Handle client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("space-y-6 animate-pulse", className)}>
        <div className="h-40 bg-secondary/20 rounded-md"></div>
        <div className="h-40 bg-secondary/20 rounded-md"></div>
        <div className="h-40 bg-secondary/20 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Streak Tracker */}
      <StreakTracker
        currentStreak={streak.currentStreak}
        longestStreak={streak.longestStreak}
        lastActive={streak.lastActive}
      />
      
      {/* Level Progression */}
      <LevelProgression
        currentLevel={level.currentLevel}
        experience={level.experience}
        nextLevelExp={level.nextLevelExp}
      />
      
      {/* Badge Showcase */}
      <BadgeShowcase badges={badges} />
    </div>
  );
}
