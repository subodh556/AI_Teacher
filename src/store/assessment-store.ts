import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question } from '@/types/core-components';

interface AssessmentState {
  // Current assessment
  currentAssessmentId: string | null;
  setCurrentAssessmentId: (id: string | null) => void;
  
  // User answers
  answers: Record<string, any>;
  setAnswer: (questionId: string, answer: any) => void;
  clearAnswers: () => void;
  
  // Assessment progress
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  isCompleted: boolean;
  setIsCompleted: (completed: boolean) => void;
  
  // Assessment results
  score: number | null;
  setScore: (score: number) => void;
  
  // Reset assessment
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      // Current assessment
      currentAssessmentId: null,
      setCurrentAssessmentId: (id) => set({ currentAssessmentId: id }),
      
      // User answers
      answers: {},
      setAnswer: (questionId, answer) => 
        set((state) => ({ 
          answers: { ...state.answers, [questionId]: answer } 
        })),
      clearAnswers: () => set({ answers: {} }),
      
      // Assessment progress
      currentQuestionIndex: 0,
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      isCompleted: false,
      setIsCompleted: (completed) => set({ isCompleted: completed }),
      
      // Assessment results
      score: null,
      setScore: (score) => set({ score }),
      
      // Reset assessment
      resetAssessment: () => set({
        currentAssessmentId: null,
        answers: {},
        currentQuestionIndex: 0,
        isCompleted: false,
        score: null,
      }),
    }),
    {
      name: 'assessment-storage',
      partialize: (state) => ({
        // Only persist the current assessment ID and completion status
        currentAssessmentId: state.currentAssessmentId,
        isCompleted: state.isCompleted,
      }),
    }
  )
);
