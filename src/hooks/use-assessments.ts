'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Question } from '@/types/core-components';
import { mockAssessmentQuestions } from '@/lib/mock-data';

// API functions for assessments
const fetchAssessments = async (): Promise<{ id: string; title: string; description: string }[]> => {
  // In a real app, this would be an API call
  // For now, we'll use mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'assessment-1', title: 'JavaScript Basics', description: 'Test your knowledge of JavaScript fundamentals' },
        { id: 'assessment-2', title: 'React Fundamentals', description: 'Test your understanding of React core concepts' },
        { id: 'assessment-3', title: 'Data Structures', description: 'Test your knowledge of common data structures' },
      ]);
    }, 500);
  });
};

const fetchAssessment = async (id: string): Promise<{ id: string; title: string; questions: Question[] }> => {
  // In a real app, this would be an API call
  // For now, we'll use mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        title: id === 'assessment-1' ? 'JavaScript Basics' : 
               id === 'assessment-2' ? 'React Fundamentals' : 'Data Structures',
        questions: mockAssessmentQuestions,
      });
    }, 300);
  });
};

const submitAssessment = async (
  assessmentId: string, 
  answers: Record<string, any>
): Promise<{ score: number; feedback: string }> => {
  // In a real app, this would be an API call
  // For now, we'll simulate scoring
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate scoring based on number of answers
      const answerCount = Object.keys(answers).length;
      const score = Math.min(100, Math.round((answerCount / mockAssessmentQuestions.length) * 100));
      
      resolve({
        score,
        feedback: score > 80 
          ? 'Excellent work!' 
          : score > 60 
          ? 'Good job, but there\'s room for improvement.' 
          : 'You should review the material and try again.',
      });
    }, 800);
  });
};

// React Query hooks
export function useAssessments() {
  return useQuery({
    queryKey: ['assessments'],
    queryFn: fetchAssessments,
  });
}

export function useAssessment(id: string | null) {
  return useQuery({
    queryKey: ['assessment', id],
    queryFn: () => fetchAssessment(id!),
    enabled: !!id, // Only run if id is provided
  });
}

export function useSubmitAssessment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: submitAssessment,
    onSuccess: (data, variables) => {
      // Update assessment cache with result
      queryClient.setQueryData(['assessment-result', variables.assessmentId], data);
      
      // Invalidate user progress to refetch
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
    },
  });
}
