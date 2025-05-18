'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle, XCircle, Clock, BookOpen,
  BarChart, ArrowRight, ChevronDown, ChevronUp,
  Award, AlertTriangle, Lightbulb, List
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AssessmentResult, QuestionResult } from '@/types/assessment';

interface AssessmentResultsProps {
  result: AssessmentResult;
  onRetake?: () => void;
  className?: string;
}

export function AssessmentResults({
  result,
  onRetake,
  className,
}: AssessmentResultsProps) {
  const [activeTab, setActiveTab] = useState('summary');

  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Calculate performance metrics
  const totalQuestions = result.questionResults.length;
  const correctAnswers = result.questionResults.filter(q => q.correct).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const averageTime = result.questionResults.reduce((sum, q) => sum + (q.timeTaken || 0), 0) / totalQuestions;

  // Determine performance level
  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-500' };
    if (score >= 75) return { label: 'Good', color: 'text-blue-500' };
    if (score >= 60) return { label: 'Satisfactory', color: 'text-yellow-500' };
    return { label: 'Needs Improvement', color: 'text-red-500' };
  };

  const performance = getPerformanceLevel(result.score);

  // Group questions by difficulty
  const questionsByDifficulty = result.questionResults.reduce((acc, q) => {
    const difficulty = q.difficulty.toString();
    if (!acc[difficulty]) acc[difficulty] = [];
    acc[difficulty].push(q);
    return acc;
  }, {} as Record<string, QuestionResult[]>);

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Assessment Results</span>
            <span className={cn('text-lg', performance.color)}>
              {performance.label}
            </span>
          </CardTitle>
          <CardDescription>
            Completed on {new Date(result.completedAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score overview */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Score</span>
              <span className="text-sm font-medium">{result.score}%</span>
            </div>
            <Progress value={result.score} className="h-2" />
          </div>

          {/* Performance summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 p-3 bg-secondary/30 rounded-md">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm font-medium">Correct</div>
                <div className="text-2xl font-bold">{correctAnswers}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 bg-secondary/30 rounded-md">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-sm font-medium">Incorrect</div>
                <div className="text-2xl font-bold">{incorrectAnswers}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 bg-secondary/30 rounded-md">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm font-medium">Time Taken</div>
                <div className="text-2xl font-bold">{formatTime(result.timeTaken)}</div>
              </div>
            </div>
          </div>

          {/* Tabs for detailed results */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="gaps">Knowledge Gaps</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Performance by Difficulty</h3>

                <div className="space-y-2">
                  {Object.entries(questionsByDifficulty).map(([difficulty, questions]) => {
                    const correct = questions.filter(q => q.correct).length;
                    const total = questions.length;
                    const percentage = Math.round((correct / total) * 100);

                    return (
                      <div key={difficulty} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span>Difficulty {difficulty}</span>
                          <span>{correct}/{total} ({percentage}%)</span>
                        </div>
                        <Progress value={percentage} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Time Performance</h3>
                <div className="text-sm">
                  Average time per question: <span className="font-medium">{formatTime(averageTime)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Overall Assessment</h3>
                <div className="text-sm">
                  {result.score >= 80 ? (
                    <div className="flex items-start space-x-2">
                      <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p>Excellent work! You have a strong understanding of this topic.</p>
                        <p className="mt-1">Consider exploring more advanced material to further enhance your knowledge.</p>
                      </div>
                    </div>
                  ) : result.score >= 60 ? (
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p>Good job! You have a solid foundation in this topic.</p>
                        <p className="mt-1">Review the areas where you made mistakes to strengthen your understanding.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p>You should review this topic more thoroughly.</p>
                        <p className="mt-1">Focus on the knowledge gaps identified in this assessment.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              {result.questionResults.map((qResult, index) => (
                <Collapsible key={qResult.questionId} className="border rounded-md">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-3 text-left">
                    <div className="flex items-center space-x-2">
                      {qResult.correct ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span>Question {index + 1}</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>

                  <CollapsibleContent className="p-3 pt-0 border-t">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Difficulty:</span> {qResult.difficulty}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Time taken:</span> {formatTime(qResult.timeTaken || 0)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Your answer:</span> {JSON.stringify(qResult.userAnswer)}
                      </div>
                      {!qResult.correct && (
                        <div className="mt-2 p-2 bg-red-500/10 rounded-md text-sm">
                          <div className="font-medium text-red-500">Incorrect Answer</div>
                          <div>Review this question to improve your understanding.</div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </TabsContent>

            <TabsContent value="gaps" className="space-y-4">
              {result.knowledgeGaps.length > 0 ? (
                <div className="space-y-4">
                  {result.knowledgeGaps.map(gap => (
                    <Card key={gap.areaId}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">{gap.name}</CardTitle>
                      </CardHeader>

                      <CardContent className="py-2">
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Proficiency:</span> {gap.proficiency}%
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm font-medium">Recommended Resources:</div>
                            {gap.recommendedResources?.map(resource => (
                              <div key={resource.id} className="flex items-center space-x-2 text-sm">
                                <Lightbulb className="h-4 w-4 text-yellow-500" />
                                <Link href={resource.url} className="text-blue-500 hover:underline">
                                  {resource.title} ({resource.type})
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">No Knowledge Gaps Detected</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Great job! You've demonstrated a solid understanding of all knowledge areas in this assessment.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link href="/assessment">
                <List className="h-4 w-4 mr-2" />
                All Assessments
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <BarChart className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>

          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/learn/${result.assessmentId}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Review Material
              </Link>
            </Button>

            {onRetake && (
              <Button onClick={onRetake}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Retake Assessment
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
