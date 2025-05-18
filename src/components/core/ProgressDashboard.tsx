"use client";

import { useState, useEffect } from "react";
import { Award, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressDashboardProps, Achievement } from "@/types/core-components";

// We'll dynamically import the heatmap component to avoid SSR issues
let CalendarHeatmap: any;

export function ProgressDashboard({
  progressData,
  achievements = [],
  streakCount = 0,
  completedToday = 0,
  className,
}: ProgressDashboardProps) {
  const [mounted, setMounted] = useState(false);

  // Handle client-side only rendering for the heatmap
  useEffect(() => {
    const loadHeatmap = async () => {
      try {
        // Dynamically import the heatmap component
        const heatmapModule = await import('react-calendar-heatmap');
        CalendarHeatmap = heatmapModule.default;

        // Import the styles
        await import('react-calendar-heatmap/dist/styles.css');

        setMounted(true);
      } catch (error) {
        console.error("Failed to load heatmap:", error);
      }
    };

    loadHeatmap();
  }, []);

  // Calculate date ranges for the heatmap
  const today = new Date();
  const endDate = new Date(today);
  const startDate = new Date(today);
  startDate.setMonth(startDate.getMonth() - 5); // Show last 6 months

  // Format dates for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get color based on activity count
  const getColor = (count: number): string => {
    if (!count) return "bg-secondary/30";
    if (count < 3) return "bg-green-900";
    if (count < 5) return "bg-green-700";
    if (count < 8) return "bg-green-500";
    return "bg-green-400";
  };

  // Render achievement item
  const renderAchievement = (achievement: Achievement) => {
    return (
      <div
        key={achievement.id}
        className={cn(
          "flex items-center p-2 rounded-md",
          achievement.earned ? "bg-secondary/30" : "bg-secondary/10 opacity-50"
        )}
      >
        <div className="mr-3 p-2 rounded-full bg-secondary/30">
          <Award className="h-4 w-4 text-blue-500" />
        </div>
        <div>
          <div className="text-sm font-medium">{achievement.title}</div>
          <div className="text-xs text-muted-foreground">{achievement.description}</div>
          {achievement.earned && achievement.earnedDate && (
            <div className="text-xs text-blue-500 mt-1">
              Earned on {achievement.earnedDate}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Streak and Completion Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-md p-4">
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <h3 className="text-sm font-medium">Current Streak</h3>
          </div>
          <div className="text-2xl font-bold">{streakCount} days</div>
        </div>
        <div className="bg-card border border-border rounded-md p-4">
          <div className="flex items-center mb-2">
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            <h3 className="text-sm font-medium">Completed Today</h3>
          </div>
          <div className="text-2xl font-bold">{completedToday}</div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-card border border-border rounded-md p-4">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
          <h3 className="text-sm font-medium">Learning Activity</h3>
        </div>

        {mounted ? (
          <div className="overflow-x-auto pb-2">
            <CalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={progressData}
              classForValue={(value) => {
                if (!value) {
                  return "color-empty";
                }
                return getColor(value.count);
              }}
              titleForValue={(value) => {
                if (!value) {
                  return "No activity";
                }
                return `${value.count} activities on ${value.date}`;
              }}
              showWeekdayLabels
              gutterSize={2}
            />
            <style jsx global>{`
              .react-calendar-heatmap text {
                font-size: 8px;
                fill: var(--muted-foreground);
              }
              .react-calendar-heatmap .color-empty {
                fill: var(--secondary);
              }
              .react-calendar-heatmap-week {
                margin-bottom: 2px;
              }
              .react-calendar-heatmap .react-calendar-heatmap-small-text {
                font-size: 6px;
              }
            `}</style>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground">Loading activity data...</p>
          </div>
        )}

        <div className="flex justify-end mt-2 space-x-2">
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 rounded-sm bg-secondary/30 mr-1"></div>
            <span>0</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 rounded-sm bg-green-900 mr-1"></div>
            <span>1-2</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 rounded-sm bg-green-700 mr-1"></div>
            <span>3-4</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 rounded-sm bg-green-500 mr-1"></div>
            <span>5-7</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 rounded-sm bg-green-400 mr-1"></div>
            <span>8+</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="bg-card border border-border rounded-md p-4">
          <div className="flex items-center mb-4">
            <Award className="h-4 w-4 mr-2 text-blue-500" />
            <h3 className="text-sm font-medium">Achievements</h3>
          </div>
          <div className="space-y-2">
            {achievements.map(renderAchievement)}
          </div>
        </div>
      )}
    </div>
  );
}
