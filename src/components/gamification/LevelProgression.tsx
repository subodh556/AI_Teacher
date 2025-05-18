"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Zap, Star, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { LevelProgressionProps } from "@/types/gamification";
import { getLevelInfo } from "@/lib/gamification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function LevelProgression({
  currentLevel,
  experience,
  nextLevelExp,
  className,
}: LevelProgressionProps) {
  const [mounted, setMounted] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  // Handle client-side only rendering and animation
  useEffect(() => {
    setMounted(true);
    
    // Animate progress bar
    const timer = setTimeout(() => {
      setProgressValue(Math.round((experience / nextLevelExp) * 100));
    }, 100);
    
    return () => clearTimeout(timer);
  }, [experience, nextLevelExp]);

  // Get level information
  const levelInfo = getLevelInfo(currentLevel);
  const nextLevelInfo = getLevelInfo(currentLevel + 1);

  // Calculate experience needed for next level
  const expNeeded = nextLevelExp - experience;
  const progressPercentage = Math.round((experience / nextLevelExp) * 100);

  if (!mounted) {
    return <div className="h-24 animate-pulse bg-secondary/20 rounded-md"></div>;
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-base font-medium">
          <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
          Level Progression
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Level Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                <Star className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-medium">{levelInfo.title}</div>
                <div className="text-xs text-muted-foreground">Level {currentLevel}</div>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-2">
                    <div className="font-medium">Level {currentLevel} Benefits</div>
                    {levelInfo.benefits && levelInfo.benefits.length > 0 ? (
                      <ul className="text-sm list-disc pl-4 space-y-1">
                        {levelInfo.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm">No special benefits for this level</div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Experience Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                <span>{experience} XP</span>
              </div>
              <div className="text-muted-foreground">
                {expNeeded} XP to Level {currentLevel + 1}
              </div>
            </div>
            <Progress value={progressValue} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Level {currentLevel}</span>
              <span>{progressPercentage}%</span>
              <span>Level {currentLevel + 1}</span>
            </div>
          </div>
          
          {/* Next Level Preview */}
          <div className="flex items-center pt-2">
            <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mr-2">
              <Star className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Next Level</div>
              <div className="text-sm font-medium">{nextLevelInfo.title}</div>
            </div>
            <div className="text-xs text-muted-foreground">
              {nextLevelExp} XP required
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
