"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Trophy,
  BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AssessmentInterface } from "@/components/core";
import { AdaptiveQuiz } from "@/components/assessment/AdaptiveQuiz";
import { AssessmentResults } from "@/components/assessment/AssessmentResults";
import { mockAssessmentQuestions } from "@/lib/mock-data";
import { Question } from "@/types/core-components";
import { Assessment, AssessmentResult } from "@/types/assessment";
import { useAssessmentStore } from "@/store/assessment-store";

// Mock function to fetch assessment data
const fetchAssessment = async (id: string): Promise<Assessment> => {
  // In a real app, this would be an API call
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Convert mock questions to the new format
  const adaptedQuestions = mockAssessmentQuestions.map(q => {
    // Base properties for all question types
    const baseQuestion = {
      id: q.id,
      prompt: q.prompt,
      explanation: q.explanation,
      difficulty: Math.ceil(Math.random() * 5) as 1 | 2 | 3 | 4 | 5, // Random difficulty for demo
      knowledgeAreaId: `area-${Math.ceil(Math.random() * 3)}`, // Random knowledge area for demo
    };

    // Create specific question type
    switch (q.type) {
      case 'multiple-choice':
        return {
          ...baseQuestion,
          type: 'multiple-choice' as const,
          options: q.options?.map((text, index) => ({ id: `opt-${index}`, text })) || [],
          correctAnswer: q.correctAnswer,
        };
      case 'text':
        return {
          ...baseQuestion,
          type: 'text' as const,
          correctAnswer: q.correctAnswer as string,
          caseSensitive: false,
          acceptableAnswers: [],
        };
      case 'coding':
        return {
          ...baseQuestion,
          type: 'coding' as const,
          language: q.language || 'javascript',
          starterCode: q.code,
          testCases: [
            { input: 'test input', expectedOutput: 'test output' },
            { input: 'test input 2', expectedOutput: 'test output 2' },
          ],
        };
      default:
        // Default to multiple-choice if type is unknown
        return {
          ...baseQuestion,
          type: 'multiple-choice' as const,
          options: q.options?.map((text, index) => ({ id: `opt-${index}`, text })) || [],
          correctAnswer: q.correctAnswer || '',
        };
    }
  });

  // Generate mock assessment based on the id
  return {
    id,
    title: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ') + " Assessment",
    description: `Test your knowledge of ${id.replace(/-/g, ' ')}.`,
    topicId: id,
    adaptive: true, // Enable adaptive assessment
    timeLimit: 20, // minutes
    passingScore: 70,
    questions: adaptedQuestions,
    difficultyRange: {
      min: 1,
      max: 5,
    },
  };
};

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;
  const [isCompleted, setIsCompleted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  // Mock user ID for demo purposes
  const userId = "user-123";

  // Fetch assessment data
  const { data: assessment, isLoading } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: () => fetchAssessment(assessmentId),
  });

  // Handle assessment completion
  const handleAssessmentComplete = (result: AssessmentResult) => {
    setAssessmentResult(result);
    setIsCompleted(true);
  };

  // Handle retaking the assessment
  const handleRetakeAssessment = () => {
    setIsCompleted(false);
    setAssessmentResult(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <h2 className="text-2xl font-bold mb-4">Assessment Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The assessment you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/dashboard">
            Return to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  // If assessment is completed, show results
  if (isCompleted && assessmentResult) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href="/assessment" className="hover:text-foreground">
            Assessments
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">Assessment Results</span>
        </div>

        <AssessmentResults
          result={assessmentResult}
          onRetake={handleRetakeAssessment}
        />
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
        <Link href="/assessment" className="hover:text-foreground">
          Assessments
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground">Assessment</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{assessment.title}</h1>
          <p className="text-muted-foreground">{assessment.description}</p>
          {assessment.adaptive && (
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              Adaptive Assessment
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/assessment">
              <ArrowLeft className="h-4 w-4 mr-2" />
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
      </div>

      <AdaptiveQuiz
        assessment={assessment}
        userId={userId}
        onComplete={handleAssessmentComplete}
        className="max-w-4xl mx-auto"
      />
    </div>
  );
}
