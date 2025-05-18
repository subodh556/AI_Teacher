"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Code,
  Award,
  BarChart,
  Clock,
  ArrowRight,
  CheckCircle,
  Zap,
  BookMarked,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressDashboard } from "@/components/core";
import { ProgressDashboardEnhanced, StrengthsWeaknesses } from "@/components/progress";
import { mockProgressData, mockAchievements, mockTopicExplorerData } from "@/lib/mock-data";
import { StrengthWeakness, TopicProgress, UserGoal, UserActivity } from "@/types/progress";

// Mock function to fetch recommended topics
const fetchRecommendedTopics = async () => {
  // In a real app, this would be an API call
  return [
    { id: "sorting", name: "Sorting Algorithms", progress: 65, path: "/learn/sorting" },
    { id: "searching", name: "Searching Algorithms", progress: 30, path: "/learn/searching" },
    { id: "dynamic-programming", name: "Dynamic Programming", progress: 10, path: "/learn/dynamic-programming" },
  ];
};

// Mock function to fetch recent activities
const fetchRecentActivities = async () => {
  // In a real app, this would be an API call
  return [
    { id: 1, type: "lesson", name: "Binary Search", date: "2023-09-15T14:30:00Z", path: "/learn/searching" },
    { id: 2, type: "practice", name: "Sorting Challenge", date: "2023-09-14T10:15:00Z", path: "/practice/sorting" },
    { id: 3, type: "assessment", name: "Data Structures Quiz", date: "2023-09-12T16:45:00Z", path: "/assessment/data-structures" },
  ];
};

export default function DashboardPage() {
  const { isLoaded, user } = useUser();

  // Fetch recommended topics
  const { data: recommendedTopics = [] } = useQuery({
    queryKey: ['recommendedTopics'],
    queryFn: fetchRecommendedTopics,
    enabled: isLoaded,
  });

  // Fetch recent activities
  const { data: recentActivities = [] } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: fetchRecentActivities,
    enabled: isLoaded,
  });

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "practice":
        return <Code className="h-4 w-4 text-green-500" />;
      case "assessment":
        return <CheckCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome, {user?.firstName || "Student"}!
        </h2>
        <p className="text-muted-foreground">
          Your personalized learning dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
            <Progress value={45} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              +2.5% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-2">
              +3 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground mt-2">
              Keep it up!
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-2">
              2 new this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendedTopics.map((topic) => (
              <div key={topic.id} className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <BookMarked className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{topic.name}</p>
                  <div className="flex items-center">
                    <Progress value={topic.progress} className="h-2 flex-1" />
                    <span className="ml-2 text-xs text-muted-foreground">{topic.progress}%</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={topic.path}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/learn">View All Topics</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your learning history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="bg-secondary/30 p-2 rounded-full">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(activity.date)}
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={activity.path}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/progress">View All Activity</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="progress">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="progress">Progress Overview</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        <TabsContent value="progress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Learning Progress</CardTitle>
              <CardDescription>Track your activity and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mock data for enhanced progress dashboard */}
              {(() => {
                // Mock strengths and weaknesses
                const strengths: StrengthWeakness[] = [
                  {
                    topicId: "algorithms",
                    topicName: "Algorithms",
                    proficiencyLevel: 85,
                    assessmentScore: 92,
                    isStrength: true
                  },
                  {
                    topicId: "programming",
                    topicName: "Programming Concepts",
                    proficiencyLevel: 80,
                    assessmentScore: 88,
                    isStrength: true
                  }
                ];

                const weaknesses: StrengthWeakness[] = [
                  {
                    topicId: "data-structures",
                    topicName: "Data Structures",
                    proficiencyLevel: 40,
                    assessmentScore: 45,
                    isStrength: false
                  },
                  {
                    topicId: "networking",
                    topicName: "Computer Networking",
                    proficiencyLevel: 35,
                    assessmentScore: 40,
                    isStrength: false
                  }
                ];

                // Mock topic progress
                const topicProgress: TopicProgress[] = [
                  {
                    id: "algorithms",
                    name: "Algorithms",
                    description: "Study of algorithms and their complexity",
                    proficiencyLevel: 85,
                    completed: true,
                    lastInteraction: "2023-09-15T14:30:00Z"
                  },
                  {
                    id: "data-structures",
                    name: "Data Structures",
                    description: "Study of data organization and storage",
                    proficiencyLevel: 40,
                    completed: false,
                    lastInteraction: "2023-09-10T09:20:00Z"
                  }
                ];

                // Mock user goals
                const goals: UserGoal[] = [
                  {
                    id: "goal1",
                    userId: "user1",
                    title: "Complete 10 Algorithm Lessons",
                    description: "Finish 10 lessons in the algorithms section",
                    targetValue: 10,
                    currentValue: 7,
                    goalType: "weekly",
                    topicId: "algorithms",
                    topicName: "Algorithms",
                    startDate: "2023-09-10T00:00:00Z",
                    endDate: "2023-09-17T23:59:59Z",
                    completed: false,
                    createdAt: "2023-09-10T00:00:00Z",
                    updatedAt: "2023-09-15T14:30:00Z"
                  }
                ];

                // Mock user activities
                const recentActivities: UserActivity[] = [
                  {
                    id: "activity1",
                    userId: "user1",
                    activityType: "lesson",
                    activityData: { title: "Binary Search", moduleId: "searching" },
                    topicId: "algorithms",
                    topicName: "Algorithms",
                    duration: 1800, // 30 minutes
                    createdAt: "2023-09-15T14:30:00Z"
                  },
                  {
                    id: "activity2",
                    userId: "user1",
                    activityType: "practice",
                    activityData: { title: "Sorting Challenge", exerciseId: "sorting" },
                    topicId: "algorithms",
                    topicName: "Algorithms",
                    duration: 2700, // 45 minutes
                    createdAt: "2023-09-14T10:15:00Z"
                  }
                ];

                return (
                  <ProgressDashboardEnhanced
                    progressData={mockProgressData}
                    achievements={mockAchievements}
                    streakCount={7}
                    completedToday={3}
                    topicProgress={topicProgress}
                    strengthsWeaknesses={{ strengths, weaknesses } as any}
                    goals={goals}
                    recentActivities={recentActivities}
                  />
                );
              })()}
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/progress">
                  View Detailed Progress
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="recommendations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>Based on your learning style and goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Try Dynamic Programming</h4>
                      <p className="text-sm text-muted-foreground">Expand your algorithm skills</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" size="sm" asChild>
                    <Link href="/learn/dynamic-programming">Start Learning</Link>
                  </Button>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Complete Binary Search Quiz</h4>
                      <p className="text-sm text-muted-foreground">Test your knowledge</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" size="sm" asChild>
                    <Link href="/assessment/binary-search">Take Quiz</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
