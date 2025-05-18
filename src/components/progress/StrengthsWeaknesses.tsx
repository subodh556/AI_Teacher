"use client";

import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StrengthWeakness } from "@/types/progress";

interface StrengthsWeaknessesProps {
  strengths: StrengthWeakness[];
  weaknesses: StrengthWeakness[];
  className?: string;
}

export function StrengthsWeaknesses({
  strengths,
  weaknesses,
  className,
}: StrengthsWeaknessesProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Strengths & Areas for Improvement</CardTitle>
        <CardDescription>
          Based on your assessment scores and learning progress
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="strengths" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="strengths">Strengths</TabsTrigger>
            <TabsTrigger value="weaknesses">Needs Improvement</TabsTrigger>
          </TabsList>
          <TabsContent value="strengths" className="p-4 pt-6">
            {strengths.length > 0 ? (
              <div className="space-y-4">
                {strengths.map((strength) => (
                  <div key={strength.topicId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                        <h3 className="text-sm font-medium">{strength.topicName}</h3>
                      </div>
                      <span className="text-sm font-medium">
                        {strength.proficiencyLevel}%
                      </span>
                    </div>
                    <Progress value={strength.proficiencyLevel} className="h-2" />
                    {strength.assessmentScore && (
                      <p className="text-xs text-muted-foreground">
                        Assessment Score: {strength.assessmentScore}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>Complete more assessments to identify your strengths</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="weaknesses" className="p-4 pt-6">
            {weaknesses.length > 0 ? (
              <div className="space-y-4">
                {weaknesses.map((weakness) => (
                  <div key={weakness.topicId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                        <h3 className="text-sm font-medium">{weakness.topicName}</h3>
                      </div>
                      <span className="text-sm font-medium">
                        {weakness.proficiencyLevel}%
                      </span>
                    </div>
                    <Progress value={weakness.proficiencyLevel} className="h-2" />
                    {weakness.assessmentScore && (
                      <p className="text-xs text-muted-foreground">
                        Assessment Score: {weakness.assessmentScore}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>Complete more assessments to identify areas for improvement</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href="/assessment">
            Take an Assessment
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
