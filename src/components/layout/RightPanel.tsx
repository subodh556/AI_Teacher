"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GamificationDashboard } from "@/components/gamification";
import { UserStreak, UserLevel, Badge } from "@/types/gamification";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

interface RightPanelProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function RightPanel({ collapsed, setCollapsed }: RightPanelProps) {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  // Fetch user streak data
  const { data: streakData, isLoading: isLoadingStreak } = useQuery({
    queryKey: ['userStreak', userId],
    queryFn: async () => {
      if (!userId) return null;
      try {
        const response = await fetch(`/api/gamification/streaks?user_id=${userId}`);
        if (!response.ok) {
          // If streak doesn't exist yet or there's a server error, return default values
          return {
            current_streak: 0,
            longest_streak: 0,
            last_active: new Date().toISOString(),
          };
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching streak data:', error);
        // Return default values on error
        return {
          current_streak: 0,
          longest_streak: 0,
          last_active: new Date().toISOString(),
        };
      }
    },
    enabled: !!userId,
  });

  // Fetch user level data
  const { data: levelData, isLoading: isLoadingLevel } = useQuery({
    queryKey: ['userLevel', userId],
    queryFn: async () => {
      if (!userId) return null;
      try {
        const response = await fetch(`/api/gamification/levels?user_id=${userId}`);
        if (!response.ok) {
          // If level doesn't exist yet or there's a server error, return default values
          return {
            current_level: 1,
            experience: 0,
            next_level_exp: 100,
          };
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching level data:', error);
        // Return default values on error
        return {
          current_level: 1,
          experience: 0,
          next_level_exp: 100,
        };
      }
    },
    enabled: !!userId,
  });

  // Fetch user badges data
  const { data: badgesData, isLoading: isLoadingBadges } = useQuery({
    queryKey: ['userBadges', userId],
    queryFn: async () => {
      if (!userId) return [];
      try {
        const response = await fetch(`/api/gamification/badges?user_id=${userId}`);
        if (!response.ok) {
          // Return empty array if there's an error
          return [];
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching badges data:', error);
        // Return empty array on error
        return [];
      }
    },
    enabled: !!userId,
    retry: false, // Don't retry on failure
  });

  // Check and update streak when component mounts
  useEffect(() => {
    const checkStreak = async () => {
      if (!userId) return;

      try {
        const response = await fetch('/api/gamification/streaks/check', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });

        // If there's an error, just log it - we'll use default values
        if (!response.ok) {
          console.log('Streak check returned non-OK response, using default values');
        }
      } catch (error) {
        // Just log the error - we'll use default values
        console.error('Error checking streak:', error);
      }
    };

    if (userId) {
      // Wrap in try/catch to prevent any unhandled errors
      try {
        checkStreak();
      } catch (error) {
        console.error('Unhandled error in checkStreak:', error);
      }
    }
  }, [userId]);

  // Format data for GamificationDashboard
  const userStreak: UserStreak | undefined = streakData ? {
    id: streakData.id || "1",
    userId: streakData.user_id || userId || "1",
    currentStreak: streakData.current_streak || 0,
    longestStreak: streakData.longest_streak || 0,
    lastActive: streakData.last_active || new Date().toISOString(),
    createdAt: streakData.created_at || new Date().toISOString(),
    updatedAt: streakData.updated_at || new Date().toISOString(),
  } : undefined;

  const userLevel: UserLevel | undefined = levelData ? {
    id: levelData.id || "1",
    userId: levelData.user_id || userId || "1",
    currentLevel: levelData.current_level || 1,
    experience: levelData.experience || 0,
    nextLevelExp: levelData.next_level_exp || 100,
    createdAt: levelData.created_at || new Date().toISOString(),
    updatedAt: levelData.updated_at || new Date().toISOString(),
  } : undefined;

  const badges: Badge[] = badgesData || [];

  const isLoading = isLoadingStreak || isLoadingLevel || isLoadingBadges || !isLoaded;

  return (
    <div
      className={cn(
        "h-full border-l border-border transition-all duration-300 bg-card",
        collapsed ? "w-12" : "w-80"
      )}
    >
      <div className="flex items-center justify-between p-2 border-b border-border">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-secondary/50"
          aria-label={collapsed ? "Expand right panel" : "Collapse right panel"}
        >
          {collapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {!collapsed && <h3 className="text-sm font-medium">Achievements & Progress</h3>}
      </div>

      {!collapsed ? (
        <div className="p-4 overflow-y-auto h-[calc(100%-40px)]">
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-40 bg-secondary/20 rounded-md"></div>
              <div className="h-40 bg-secondary/20 rounded-md"></div>
              <div className="h-40 bg-secondary/20 rounded-md"></div>
            </div>
          ) : (
            <GamificationDashboard
              streak={userStreak}
              level={userLevel}
              badges={badges}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
