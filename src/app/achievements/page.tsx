"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { 
  ChevronRight, 
  Award, 
  Trophy, 
  Star, 
  Zap, 
  Calendar, 
  BookOpen, 
  Code, 
  CheckCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { mockAchievements } from "@/lib/mock-data";
import { Achievement } from "@/types/core-components";

// Mock function to fetch achievements data
const fetchAchievementsData = async () => {
  // In a real app, this would be an API call
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Extended achievements data
  const extendedAchievements: Achievement[] = [
    ...mockAchievements,
    {
      id: "a6",
      title: "Coding Master",
      description: "Complete 50 coding exercises",
      icon: "code",
      earned: false,
    },
    {
      id: "a7",
      title: "Knowledge Explorer",
      description: "Study all topics in at least one category",
      icon: "book-open",
      earned: false,
    },
    {
      id: "a8",
      title: "Perfect Streak",
      description: "Maintain a 7-day streak with perfect scores",
      icon: "zap",
      earned: false,
    },
  ];
  
  return {
    achievements: extendedAchievements,
    categories: [
      { id: "learning", name: "Learning", icon: "book-open" },
      { id: "practice", name: "Practice", icon: "code" },
      { id: "assessment", name: "Assessment", icon: "check-circle" },
      { id: "streak", name: "Consistency", icon: "calendar" },
    ],
    stats: {
      totalAchievements: extendedAchievements.length,
      earnedAchievements: extendedAchievements.filter(a => a.earned).length,
      nextMilestone: "Complete 10 coding exercises",
      progress: 35, // percentage towards next milestone
    }
  };
};

export default function AchievementsPage() {
  // Fetch achievements data
  const { data: achievementsData, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: fetchAchievementsData,
  });

  // Get icon component based on icon name
  const getIconComponent = (iconName: string, className: string = "h-6 w-6") => {
    switch (iconName) {
      case "award":
        return <Award className={className} />;
      case "trophy":
        return <Trophy className={className} />;
      case "star":
        return <Star className={className} />;
      case "zap":
        return <Zap className={className} />;
      case "calendar":
        return <Calendar className={className} />;
      case "book-open":
        return <BookOpen className={className} />;
      case "code":
        return <Code className={className} />;
      case "check-circle":
        return <CheckCircle className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    );
  }

  if (!achievementsData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <h2 className="text-2xl font-bold mb-4">No Achievements Found</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find any achievements for your account.
        </p>
        <Button asChild>
          <Link href="/dashboard">
            Return to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground">Achievements</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Your Achievements</h1>
          <p className="text-muted-foreground">Track your accomplishments and unlock new badges</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Achievement Progress</CardTitle>
            <CardDescription>
              You've earned {achievementsData.stats.earnedAchievements} out of {achievementsData.stats.totalAchievements} achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm">
                  {achievementsData.stats.earnedAchievements}/{achievementsData.stats.totalAchievements}
                </span>
              </div>
              <Progress 
                value={(achievementsData.stats.earnedAchievements / achievementsData.stats.totalAchievements) * 100} 
                className="h-2" 
              />
              
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Next Milestone</h4>
                <div className="flex items-center p-3 bg-secondary/20 rounded-md">
                  <Zap className="h-5 w-5 text-yellow-500 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{achievementsData.stats.nextMilestone}</p>
                    <div className="flex items-center mt-1">
                      <Progress value={achievementsData.stats.progress} className="h-1.5 flex-1" />
                      <span className="ml-2 text-xs text-muted-foreground">{achievementsData.stats.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Achievement Categories</CardTitle>
            <CardDescription>Explore different types of achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievementsData.categories.map((category) => (
                <div key={category.id} className="flex items-center p-2 rounded-md hover:bg-secondary/30 transition-colors">
                  <div className="bg-secondary/30 p-2 rounded-full mr-3">
                    {getIconComponent(category.icon, "h-4 w-4")}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{category.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Achievements</TabsTrigger>
          <TabsTrigger value="earned">Earned</TabsTrigger>
          <TabsTrigger value="locked">Locked</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievementsData.achievements.map((achievement) => (
              <Card key={achievement.id} className={`border ${achievement.earned ? 'bg-secondary/20' : 'bg-secondary/5 opacity-70'}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <div className={`p-2 rounded-full ${achievement.earned ? 'bg-primary/20' : 'bg-secondary/30'}`}>
                      {getIconComponent(achievement.icon, "h-5 w-5")}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                  {achievement.earned ? (
                    <div className="text-xs text-green-500">
                      Earned on {achievement.earnedDate}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Not yet earned
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="earned">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievementsData.achievements
              .filter(achievement => achievement.earned)
              .map((achievement) => (
                <Card key={achievement.id} className="border bg-secondary/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <div className="p-2 rounded-full bg-primary/20">
                        {getIconComponent(achievement.icon, "h-5 w-5")}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                    <div className="text-xs text-green-500">
                      Earned on {achievement.earnedDate}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="locked">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievementsData.achievements
              .filter(achievement => !achievement.earned)
              .map((achievement) => (
                <Card key={achievement.id} className="border bg-secondary/5 opacity-70">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <div className="p-2 rounded-full bg-secondary/30">
                        {getIconComponent(achievement.icon, "h-5 w-5")}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                    <div className="text-xs text-muted-foreground">
                      Not yet earned
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
