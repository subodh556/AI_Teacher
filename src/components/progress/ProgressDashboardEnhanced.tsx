"use client";

import { useState, useEffect } from "react";
import { Award, Calendar, CheckCircle2, TrendingUp, Clock, Target, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressDashboardEnhancedProps } from "@/types/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StrengthsWeaknesses } from "./StrengthsWeaknesses";
import { GoalTracker } from "./GoalTracker";

// We'll dynamically import the heatmap component to avoid SSR issues
let CalendarHeatmap: any;

export function ProgressDashboardEnhanced({
  progressData,
  achievements = [],
  streakCount = 0,
  completedToday = 0,
  topicProgress = [],
  strengthsWeaknesses = { strengths: [], weaknesses: [] } as any,
  goals = [],
  recentActivities = [],
  className,
}: ProgressDashboardEnhancedProps) {
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

  // Calculate date range for heatmap
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 180); // 6 months ago

  // Helper function to get color based on activity count
  const getColor = (count: number) => {
    if (count >= 10) return "color-scale-4";
    if (count >= 7) return "color-scale-3";
    if (count >= 4) return "color-scale-2";
    return "color-scale-1";
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Current Streak</p>
                    <h3 className="text-xl font-bold">{streakCount} days</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Completed Today</p>
                    <h3 className="text-xl font-bold">{completedToday}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Achievements</p>
                    <h3 className="text-xl font-bold">
                      {achievements.filter(a => a.earned).length}/{achievements.length}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Topics Completed</p>
                    <h3 className="text-xl font-bold">
                      {topicProgress.filter(t => t.completed).length}/{topicProgress.length}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Heatmap */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Learning Activity</CardTitle>
              <CardDescription>Your activity over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
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
                    .react-calendar-heatmap .color-scale-1 {
                      fill: var(--primary-300);
                    }
                    .react-calendar-heatmap .color-scale-2 {
                      fill: var(--primary-400);
                    }
                    .react-calendar-heatmap .color-scale-3 {
                      fill: var(--primary-500);
                    }
                    .react-calendar-heatmap .color-scale-4 {
                      fill: var(--primary-600);
                    }
                  `}</style>
                </div>
              ) : (
                <div className="h-[120px] flex items-center justify-center">
                  <div className="animate-pulse text-muted-foreground">Loading activity data...</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Strengths and Weaknesses */}
          <StrengthsWeaknesses
            strengths={strengthsWeaknesses.strengths || []}
            weaknesses={strengthsWeaknesses.weaknesses || []}
          />
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Goals Tracker */}
          <GoalTracker
            goals={goals}
            topics={topicProgress.map(t => ({ id: t.id, name: t.name }))}
          />
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {activity.activityType === 'lesson' && <BookOpen className="h-4 w-4 text-primary" />}
                        {activity.activityType === 'assessment' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        {activity.activityType === 'practice' && <TrendingUp className="h-4 w-4 text-blue-500" />}
                        {activity.activityType === 'other' && <Clock className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">
                            {activity.activityData.title || `${activity.activityType.charAt(0).toUpperCase() + activity.activityType.slice(1)}`}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(activity.createdAt)}
                          </span>
                        </div>
                        {activity.topicName && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Topic: {activity.topicName}
                          </p>
                        )}
                        {activity.duration && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Duration: {Math.floor(activity.duration / 60)} min
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No recent activities found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your earned achievements</CardDescription>
            </CardHeader>
            <CardContent>
              {achievements.filter(a => a.earned).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {achievements
                    .filter(a => a.earned)
                    .map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 border rounded-md p-3">
                        <div className="bg-yellow-500/10 p-2 rounded-full">
                          <Award className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          {achievement.earnedDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Earned: {formatDate(achievement.earnedDate)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No achievements earned yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
