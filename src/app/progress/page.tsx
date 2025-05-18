"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  BarChart2,
  TrendingUp,
  Calendar,
  Clock,
  BookOpen,
  Code,
  CheckCircle,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ProgressChart,
  StrengthsWeaknesses,
  GoalTracker,
  ProgressExportComponent,
  ProgressDashboardEnhanced
} from "@/components/progress";
import { mockProgressData, mockAchievements } from "@/lib/mock-data";
import { UserGoal, ProgressExport, StrengthWeakness, TopicProgress, UserActivity } from "@/types/progress";

// Function to fetch progress data from API
const fetchProgressData = async () => {
  try {
    // In a real app, this would be an API call to /api/progress/summary
    // For now, we'll simulate the API response
    await new Promise(resolve => setTimeout(resolve, 500));

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
      },
      {
        topicId: "databases",
        topicName: "Databases",
        proficiencyLevel: 75,
        assessmentScore: 82,
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
      },
      {
        topicId: "security",
        topicName: "Security Concepts",
        proficiencyLevel: 30,
        assessmentScore: 35,
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
        lastInteraction: "2023-09-15T14:30:00Z",
        assessmentsTaken: 3,
        averageScore: 92
      },
      {
        id: "data-structures",
        name: "Data Structures",
        description: "Study of data organization and storage",
        proficiencyLevel: 40,
        completed: false,
        lastInteraction: "2023-09-10T09:20:00Z",
        assessmentsTaken: 2,
        averageScore: 45
      },
      {
        id: "programming",
        name: "Programming Concepts",
        description: "Fundamental programming concepts and paradigms",
        proficiencyLevel: 80,
        completed: true,
        lastInteraction: "2023-09-14T10:15:00Z",
        assessmentsTaken: 4,
        averageScore: 88
      },
      {
        id: "databases",
        name: "Databases",
        description: "Database design and management",
        proficiencyLevel: 75,
        completed: true,
        lastInteraction: "2023-09-08T11:05:00Z",
        assessmentsTaken: 3,
        averageScore: 82
      },
      {
        id: "networking",
        name: "Computer Networking",
        description: "Computer networking principles and protocols",
        proficiencyLevel: 35,
        completed: false,
        lastInteraction: "2023-09-05T15:45:00Z",
        assessmentsTaken: 1,
        averageScore: 40
      },
      {
        id: "security",
        name: "Security Concepts",
        description: "Computer and network security principles",
        proficiencyLevel: 30,
        completed: false,
        lastInteraction: "2023-09-03T13:20:00Z",
        assessmentsTaken: 1,
        averageScore: 35
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
      },
      {
        id: "goal2",
        userId: "user1",
        title: "Practice Data Structures Daily",
        description: "Complete at least one data structure exercise every day",
        targetValue: 7,
        currentValue: 3,
        goalType: "daily",
        topicId: "data-structures",
        topicName: "Data Structures",
        startDate: "2023-09-10T00:00:00Z",
        endDate: "2023-09-17T23:59:59Z",
        completed: false,
        createdAt: "2023-09-10T00:00:00Z",
        updatedAt: "2023-09-14T10:15:00Z"
      },
      {
        id: "goal3",
        userId: "user1",
        title: "Achieve 80% in All Assessments",
        description: "Score at least 80% in all monthly assessments",
        targetValue: 5,
        currentValue: 3,
        goalType: "monthly",
        topicId: "",
        startDate: "2023-09-01T00:00:00Z",
        endDate: "2023-09-30T23:59:59Z",
        completed: false,
        createdAt: "2023-09-01T00:00:00Z",
        updatedAt: "2023-09-12T16:45:00Z"
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
      },
      {
        id: "activity3",
        userId: "user1",
        activityType: "assessment",
        activityData: { title: "Data Structures Quiz", score: 45 },
        topicId: "data-structures",
        topicName: "Data Structures",
        duration: 1200, // 20 minutes
        createdAt: "2023-09-12T16:45:00Z"
      },
      {
        id: "activity4",
        userId: "user1",
        activityType: "lesson",
        activityData: { title: "Dynamic Programming", moduleId: "dynamic-programming" },
        topicId: "algorithms",
        topicName: "Algorithms",
        duration: 2400, // 40 minutes
        createdAt: "2023-09-10T09:20:00Z"
      },
      {
        id: "activity5",
        userId: "user1",
        activityType: "practice",
        activityData: { title: "Linked Lists", exerciseId: "linked-lists" },
        topicId: "data-structures",
        topicName: "Data Structures",
        duration: 1500, // 25 minutes
        createdAt: "2023-09-08T11:05:00Z"
      }
    ];

    // Chart data for progress over time
    const chartData = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
      datasets: [
        {
          label: "Algorithms",
          data: [20, 35, 45, 60, 75, 85],
          borderColor: "rgba(59, 130, 246, 0.8)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          fill: true
        },
        {
          label: "Data Structures",
          data: [10, 15, 20, 25, 35, 40],
          borderColor: "rgba(16, 185, 129, 0.8)",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          fill: true
        },
        {
          label: "Programming",
          data: [30, 40, 50, 60, 70, 80],
          borderColor: "rgba(249, 115, 22, 0.8)",
          backgroundColor: "rgba(249, 115, 22, 0.2)",
          fill: true
        }
      ]
    };

    return {
      progressData: mockProgressData,
      achievements: mockAchievements,
      streakCount: 7,
      completedToday: 3,
      topicProgress,
      strengthsWeaknesses: { strengths, weaknesses },
      goals,
      recentActivities,
      chartData,
      weeklyStats: {
        lessonsCompleted: 5,
        practiceExercises: 8,
        assessmentsTaken: 2,
        totalTimeSpent: 420, // minutes
      },
    };
  } catch (error) {
    console.error("Error fetching progress data:", error);
    throw error;
  }
};

export default function ProgressPage() {
  // State for user ID (in a real app, this would come from authentication)
  const [userId, setUserId] = useState("user1");

  // Fetch progress data
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: fetchProgressData,
  });

  // Mutation for creating a goal
  const createGoalMutation = useMutation({
    mutationFn: async (goal: Omit<UserGoal, "id" | "createdAt" | "updatedAt">) => {
      // In a real app, this would be an API call to /api/progress/goals
      console.log("Creating goal:", goal);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: `goal${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...goal };
    },
    onSuccess: () => {
      // Refetch progress data after creating a goal
      // queryClient.invalidateQueries({ queryKey: ['progress'] });
    }
  });

  // Mutation for updating a goal
  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<UserGoal> }) => {
      // In a real app, this would be an API call to /api/progress/goals/[id]
      console.log("Updating goal:", id, updates);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id, ...updates };
    },
    onSuccess: () => {
      // Refetch progress data after updating a goal
      // queryClient.invalidateQueries({ queryKey: ['progress'] });
    }
  });

  // Mutation for deleting a goal
  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      // In a real app, this would be an API call to /api/progress/goals/[id]
      console.log("Deleting goal:", id);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: () => {
      // Refetch progress data after deleting a goal
      // queryClient.invalidateQueries({ queryKey: ['progress'] });
    }
  });

  // Mutation for exporting progress data
  const exportProgressMutation = useMutation({
    mutationFn: async (exportOptions: ProgressExport) => {
      // In a real app, this would be an API call to /api/progress/export
      console.log("Exporting progress data:", exportOptions);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app, this would return the exported data
      // For now, we'll just simulate a download
      const blob = new Blob([JSON.stringify({ exportDate: new Date().toISOString(), ...exportOptions })], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `progress-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return true;
    }
  });

  // Format time for display
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading progress data...</p>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <h2 className="text-2xl font-bold mb-4">No Progress Data Found</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find any progress data for your account.
        </p>
        <Button asChild>
          <Link href="/dashboard">
            Return to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  // Handle goal creation
  const handleCreateGoal = (goal: Omit<UserGoal, "id" | "createdAt" | "updatedAt">) => {
    createGoalMutation.mutate({ ...goal, userId });
  };

  // Handle goal update
  const handleUpdateGoal = (id: string, updates: Partial<UserGoal>) => {
    updateGoalMutation.mutate({ id, updates });
  };

  // Handle goal deletion
  const handleDeleteGoal = (id: string) => {
    deleteGoalMutation.mutate(id);
  };

  // Handle progress export
  const handleExportProgress = (exportOptions: ProgressExport) => {
    exportProgressMutation.mutate(exportOptions);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground">Progress</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Your Learning Progress</h1>
          <p className="text-muted-foreground">Track your journey and see how far you've come</p>
        </div>
        <Button asChild>
          <Link href="/assessment">
            Take an Assessment
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">{progressData.streakCount} days</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">{progressData.completedToday} activities</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Learning Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">{formatTime(progressData.weeklyStats.totalTimeSpent)}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Achievements Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-yellow-500 mr-2" />
              <div className="text-2xl font-bold">
                {progressData.achievements.filter(a => a.earned).length}/{progressData.achievements.length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="topics">Topic Progress</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 gap-6">
            {/* Enhanced Progress Dashboard */}
            <ProgressDashboardEnhanced
              progressData={progressData.progressData}
              achievements={progressData.achievements}
              streakCount={progressData.streakCount}
              completedToday={progressData.completedToday}
              topicProgress={progressData.topicProgress}
              strengthsWeaknesses={progressData.strengthsWeaknesses}
              goals={progressData.goals}
              recentActivities={progressData.recentActivities}
            />

            {/* Progress Chart */}
            <ProgressChart
              data={progressData.chartData}
              title="Progress Over Time"
              description="Your proficiency level progress across topics"
              height={300}
            />
          </div>
        </TabsContent>

        <TabsContent value="topics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Topic Progress</CardTitle>
                <CardDescription>Your progress across different learning topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {progressData.topicProgress.map((topic) => (
                    <div key={topic.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Link href={`/learn/${topic.id}`} className="text-lg font-medium hover:underline">
                          {topic.name}
                        </Link>
                        <span className="text-sm font-medium">{topic.proficiencyLevel}%</span>
                      </div>
                      <Progress value={topic.proficiencyLevel} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {topic.assessmentsTaken} assessment{topic.assessmentsTaken !== 1 ? 's' : ''} taken
                        </span>
                        <span>
                          {topic.completed ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="link" size="sm" asChild className="h-auto p-0">
                          <Link href={`/learn/${topic.id}`}>
                            Continue Learning
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <StrengthsWeaknesses
              strengths={progressData.strengthsWeaknesses.strengths}
              weaknesses={progressData.strengthsWeaknesses.weaknesses}
            />
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <div className="grid grid-cols-1 gap-6">
            <GoalTracker
              goals={progressData.goals}
              topics={progressData.topicProgress.map(t => ({ id: t.id, name: t.name }))}
              onCreateGoal={handleCreateGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          </div>
        </TabsContent>

        <TabsContent value="export">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgressExportComponent
              userId={userId}
              onExport={handleExportProgress}
            />

            <Card>
              <CardHeader>
                <CardTitle>About Data Export</CardTitle>
                <CardDescription>Information about exporting your progress data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  You can export your learning progress data for personal analysis or backup.
                  The exported data includes:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your progress across all topics</li>
                  <li>Assessment results and scores</li>
                  <li>Learning activities and time spent</li>
                  <li>Achievements earned</li>
                  <li>Goals and progress metrics</li>
                </ul>
                <p>
                  The data is exported in JSON format, which can be imported into spreadsheet
                  applications or data analysis tools.
                </p>
                <div className="bg-secondary/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Privacy Note</h3>
                  <p className="text-sm text-muted-foreground">
                    Your exported data contains personal information. Please store it securely
                    and be careful when sharing it with third parties.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => window.print()}>
                  <Download className="h-4 w-4 mr-2" />
                  Print Progress Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
