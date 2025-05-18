"use client";

import { useState, useEffect } from "react";
import { Calendar, Flame, Trophy, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { StreakTrackerProps } from "@/types/gamification";
import { isStreakActive, formatDate } from "@/lib/gamification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function StreakTracker({
  currentStreak,
  longestStreak,
  lastActive,
  className,
}: StreakTrackerProps) {
  const [mounted, setMounted] = useState(false);
  const [streakActive, setStreakActive] = useState(true);

  // Handle client-side only rendering
  useEffect(() => {
    setMounted(true);
    setStreakActive(isStreakActive(lastActive));
  }, [lastActive]);

  // Format date for display
  const formattedLastActive = formatDate(lastActive);

  // Calculate streak status
  const getStreakStatus = () => {
    if (!streakActive) {
      return {
        message: "Streak at risk! Log in today to maintain your streak.",
        color: "text-red-500",
      };
    }
    
    if (currentStreak >= 30) {
      return {
        message: "Amazing streak! Keep up the great work!",
        color: "text-green-500",
      };
    }
    
    if (currentStreak >= 7) {
      return {
        message: "Great streak! You're building a solid habit.",
        color: "text-green-500",
      };
    }
    
    return {
      message: "You're on your way! Keep learning daily.",
      color: "text-blue-500",
    };
  };

  const { message, color } = getStreakStatus();

  // Render streak flames
  const renderStreakFlames = () => {
    const flames = [];
    const maxFlames = 7; // Show max 7 flames
    const displayStreak = Math.min(currentStreak, maxFlames);
    
    for (let i = 0; i < maxFlames; i++) {
      flames.push(
        <TooltipProvider key={i}>
          <Tooltip>
            <TooltipTrigger>
              <Flame
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  i < displayStreak
                    ? "text-orange-500 scale-110"
                    : "text-muted-foreground opacity-30"
                )}
              />
            </TooltipTrigger>
            <TooltipContent>
              {i < displayStreak
                ? `Day ${i + 1} of your streak`
                : "Continue your streak to light this flame"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return flames;
  };

  if (!mounted) {
    return <div className="h-24 animate-pulse bg-secondary/20 rounded-md"></div>;
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-base font-medium">
          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
          Learning Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Current Streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Flame className={cn("h-5 w-5 mr-2", streakActive ? "text-orange-500" : "text-muted-foreground")} />
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <span className="text-xl font-bold">{currentStreak} days</span>
          </div>
          
          {/* Streak Flames Visualization */}
          <div className="flex items-center justify-center space-x-1 py-2">
            {renderStreakFlames()}
            {currentStreak > 7 && (
              <span className="text-sm font-medium ml-2 text-muted-foreground">
                +{currentStreak - 7} more
              </span>
            )}
          </div>
          
          {/* Streak Status */}
          <p className={cn("text-sm text-center", color)}>
            {message}
          </p>
          
          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Longest</span>
                <span className="text-sm font-medium">{longestStreak} days</span>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Last Active</span>
                <span className="text-sm font-medium">{formattedLastActive}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
