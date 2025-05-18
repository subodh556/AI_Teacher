"use client";

import { useState } from "react";
import { Award, Medal, Code, Calendar, CheckCircle, Star, Zap, BookOpen, Trophy, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { BadgeShowcaseProps, Badge, BadgeCategory, BadgeTier } from "@/types/gamification";
import { getBadgeTierColor, getBadgeTierBgColor, formatDate } from "@/lib/gamification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function BadgeShowcase({
  badges,
  className,
}: BadgeShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<BadgeCategory | 'all'>('all');

  // Filter badges by category
  const filteredBadges = activeCategory === 'all'
    ? badges
    : badges.filter(badge => badge.category === activeCategory);

  // Sort badges: earned first, then by tier
  const sortedBadges = [...filteredBadges].sort((a, b) => {
    // First sort by earned status
    if (a.earnedAt && !b.earnedAt) return -1;
    if (!a.earnedAt && b.earnedAt) return 1;
    
    // Then sort by tier
    const tierOrder: Record<BadgeTier, number> = {
      platinum: 1,
      gold: 2,
      silver: 3,
      bronze: 4
    };
    
    return tierOrder[a.tier] - tierOrder[b.tier];
  });

  // Count badges by category
  const badgeCounts = {
    all: badges.length,
    learning: badges.filter(b => b.category === 'learning').length,
    assessment: badges.filter(b => b.category === 'assessment').length,
    coding: badges.filter(b => b.category === 'coding').length,
    streak: badges.filter(b => b.category === 'streak').length,
    achievement: badges.filter(b => b.category === 'achievement').length,
  };

  // Count earned badges
  const earnedBadges = badges.filter(b => b.earnedAt).length;
  const earnedPercentage = badges.length > 0 
    ? Math.round((earnedBadges / badges.length) * 100) 
    : 0;

  // Get icon component for badge
  const getBadgeIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      award: <Award className="h-full w-full" />,
      medal: <Medal className="h-full w-full" />,
      code: <Code className="h-full w-full" />,
      calendar: <Calendar className="h-full w-full" />,
      "check-circle": <CheckCircle className="h-full w-full" />,
      star: <Star className="h-full w-full" />,
      zap: <Zap className="h-full w-full" />,
      "book-open": <BookOpen className="h-full w-full" />,
      trophy: <Trophy className="h-full w-full" />,
    };
    
    return iconMap[iconName] || <Award className="h-full w-full" />;
  };

  // Render individual badge
  const renderBadge = (badge: Badge) => {
    const isEarned = !!badge.earnedAt;
    const tierColor = getBadgeTierColor(badge.tier);
    const tierBgColor = getBadgeTierBgColor(badge.tier);
    
    return (
      <TooltipProvider key={badge.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={cn(
                "relative flex flex-col items-center p-3 rounded-md transition-all duration-300",
                isEarned ? tierBgColor : "bg-secondary/10 opacity-50"
              )}
            >
              <div className={cn(
                "w-12 h-12 flex items-center justify-center rounded-full mb-2",
                isEarned ? tierBgColor : "bg-secondary/20"
              )}>
                <div className={cn("w-6 h-6", isEarned ? tierColor : "text-muted-foreground")}>
                  {isEarned ? getBadgeIcon(badge.iconName) : <Lock className="h-full w-full" />}
                </div>
              </div>
              <div className="text-xs font-medium text-center truncate w-full">
                {badge.name}
              </div>
              {isEarned && (
                <div className={cn("text-[10px] mt-1", tierColor)}>
                  {badge.tier.charAt(0).toUpperCase() + badge.tier.slice(1)}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2">
              <div className="font-medium">{badge.name}</div>
              <div className="text-sm">{badge.description}</div>
              {isEarned && badge.earnedAt && (
                <div className={cn("text-xs", tierColor)}>
                  Earned on {formatDate(badge.earnedAt)}
                </div>
              )}
              {!isEarned && (
                <div className="text-xs text-muted-foreground">
                  {badge.criteria.type === 'streak_days' 
                    ? `Maintain a ${badge.criteria.threshold}-day streak to earn`
                    : badge.criteria.type === 'lesson_completion'
                    ? `Complete ${badge.criteria.threshold} lessons to earn`
                    : badge.criteria.type === 'assessment_score'
                    ? `Get ${badge.criteria.threshold} high scores to earn`
                    : 'Complete the requirements to earn'}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base font-medium">
          <div className="flex items-center">
            <Award className="h-4 w-4 mr-2 text-blue-500" />
            Badges & Achievements
          </div>
          <div className="text-sm font-normal text-muted-foreground">
            {earnedBadges}/{badges.length} ({earnedPercentage}%)
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={(v) => setActiveCategory(v as any)}>
          <TabsList className="w-full justify-start px-4 pt-2 pb-0 bg-transparent">
            <TabsTrigger value="all" className="text-xs h-8 px-2">
              All ({badgeCounts.all})
            </TabsTrigger>
            <TabsTrigger value="learning" className="text-xs h-8 px-2">
              Learning ({badgeCounts.learning})
            </TabsTrigger>
            <TabsTrigger value="assessment" className="text-xs h-8 px-2">
              Assessment ({badgeCounts.assessment})
            </TabsTrigger>
            <TabsTrigger value="coding" className="text-xs h-8 px-2">
              Coding ({badgeCounts.coding})
            </TabsTrigger>
            <TabsTrigger value="streak" className="text-xs h-8 px-2">
              Streak ({badgeCounts.streak})
            </TabsTrigger>
          </TabsList>
          
          <div className="p-4">
            {sortedBadges.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {sortedBadges.map(renderBadge)}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No badges in this category yet
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
