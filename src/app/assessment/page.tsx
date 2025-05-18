'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ChevronRight, BookOpen, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssessmentList, AssessmentListItem } from '@/components/assessment/AssessmentList';

// Mock function to fetch assessments
const fetchAssessments = async (): Promise<AssessmentListItem[]> => {
  // In a real app, this would be an API call
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock assessments
  return [
    {
      id: 'javascript-basics',
      title: 'JavaScript Basics Assessment',
      description: 'Test your knowledge of JavaScript fundamentals including variables, data types, functions, and control flow.',
      topicId: 'javascript-basics',
      difficulty: 'beginner',
      timeEstimate: 20,
      questionCount: 10,
      adaptive: true,
      tags: ['JavaScript', 'Programming', 'Web Development'],
      completedByUser: true,
      userScore: 85,
    },
    {
      id: 'react-fundamentals',
      title: 'React Fundamentals Assessment',
      description: 'Test your understanding of React components, props, state, and lifecycle methods.',
      topicId: 'react-fundamentals',
      difficulty: 'intermediate',
      timeEstimate: 30,
      questionCount: 15,
      adaptive: true,
      tags: ['React', 'JavaScript', 'Frontend'],
    },
    {
      id: 'data-structures',
      title: 'Data Structures Assessment',
      description: 'Test your knowledge of common data structures including arrays, linked lists, trees, and graphs.',
      topicId: 'data-structures',
      difficulty: 'advanced',
      timeEstimate: 45,
      questionCount: 20,
      adaptive: false,
      tags: ['Data Structures', 'Algorithms', 'Computer Science'],
    },
    {
      id: 'css-and-styling',
      title: 'CSS and Styling Assessment',
      description: 'Test your knowledge of CSS fundamentals, layouts, responsive design, and modern styling techniques.',
      topicId: 'css-and-styling',
      difficulty: 'beginner',
      timeEstimate: 25,
      questionCount: 12,
      adaptive: true,
      tags: ['CSS', 'Web Design', 'Frontend'],
      completedByUser: true,
      userScore: 92,
    },
    {
      id: 'backend-development',
      title: 'Backend Development Assessment',
      description: 'Test your knowledge of server-side programming, APIs, databases, and authentication.',
      topicId: 'backend-development',
      difficulty: 'intermediate',
      timeEstimate: 35,
      questionCount: 18,
      adaptive: false,
      tags: ['Backend', 'API', 'Database'],
    },
    {
      id: 'algorithms',
      title: 'Algorithms Assessment',
      description: 'Test your knowledge of common algorithms including sorting, searching, and graph algorithms.',
      topicId: 'algorithms',
      difficulty: 'advanced',
      timeEstimate: 50,
      questionCount: 15,
      adaptive: true,
      tags: ['Algorithms', 'Computer Science', 'Problem Solving'],
    },
    {
      id: 'html-fundamentals',
      title: 'HTML Fundamentals Assessment',
      description: 'Test your knowledge of HTML elements, attributes, forms, and semantic markup.',
      topicId: 'html-fundamentals',
      difficulty: 'beginner',
      timeEstimate: 15,
      questionCount: 10,
      adaptive: false,
      tags: ['HTML', 'Web Development', 'Frontend'],
      completedByUser: true,
      userScore: 100,
    },
    {
      id: 'typescript-basics',
      title: 'TypeScript Basics Assessment',
      description: 'Test your knowledge of TypeScript types, interfaces, classes, and generics.',
      topicId: 'typescript-basics',
      difficulty: 'intermediate',
      timeEstimate: 25,
      questionCount: 12,
      adaptive: true,
      tags: ['TypeScript', 'JavaScript', 'Programming'],
    },
    {
      id: 'system-design',
      title: 'System Design Assessment',
      description: 'Test your knowledge of system design principles, scalability, and distributed systems.',
      topicId: 'system-design',
      difficulty: 'advanced',
      timeEstimate: 60,
      questionCount: 10,
      adaptive: false,
      tags: ['System Design', 'Architecture', 'Scalability'],
    },
  ];
};

export default function AssessmentsPage() {
  // Fetch assessments
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: fetchAssessments,
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading assessments...</p>
        </div>
      </div>
    );
  }
  
  if (!assessments) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <h2 className="text-2xl font-bold mb-4">Assessments Not Found</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't load the assessments. Please try again later.
        </p>
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          Return to Dashboard
        </Link>
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
        <span className="text-foreground">Assessments</span>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Assessments</h1>
          <p className="text-muted-foreground">
            Test your knowledge and identify areas for improvement.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/knowledge-map">
              <BarChart className="h-4 w-4 mr-2" />
              Knowledge Map
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/learn">
              <BookOpen className="h-4 w-4 mr-2" />
              Learning Materials
            </Link>
          </Button>
        </div>
      </div>
      
      <AssessmentList assessments={assessments} />
    </div>
  );
}
