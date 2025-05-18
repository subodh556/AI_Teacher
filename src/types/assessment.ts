/**
 * Assessment System Types
 * 
 * This file contains types for the assessment system, including questions,
 * assessments, knowledge mapping, and results visualization.
 */

// Question Types
export type QuestionType = 'multiple-choice' | 'coding' | 'text' | 'problem-solving';

export type QuestionDifficulty = 1 | 2 | 3 | 4 | 5; // 1 = Easiest, 5 = Hardest

export interface QuestionOption {
  id: string;
  text: string;
}

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  explanation?: string;
  difficulty: QuestionDifficulty;
  knowledgeAreaId?: string; // Links to specific knowledge area
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: QuestionOption[];
  correctAnswer: string | string[]; // Single or multiple correct answers
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
  correctAnswer: string;
  caseSensitive?: boolean;
  acceptableAnswers?: string[]; // Alternative correct answers
}

export interface CodingQuestion extends BaseQuestion {
  type: 'coding';
  starterCode?: string;
  language: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
  solutionCode?: string;
}

export interface ProblemSolvingQuestion extends BaseQuestion {
  type: 'problem-solving';
  steps: {
    id: string;
    prompt: string;
    correctAnswer: string;
    hint?: string;
  }[];
}

export type Question = 
  | MultipleChoiceQuestion 
  | TextQuestion 
  | CodingQuestion 
  | ProblemSolvingQuestion;

// Assessment Types
export interface Assessment {
  id: string;
  title: string;
  description: string;
  topicId: string;
  adaptive: boolean;
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  questions: Question[];
  difficultyRange?: {
    min: QuestionDifficulty;
    max: QuestionDifficulty;
  };
}

// Knowledge Mapping Types
export interface KnowledgeArea {
  id: string;
  name: string;
  description: string;
  parentId?: string; // For hierarchical knowledge areas
  topics: string[]; // Related topic IDs
}

export interface UserKnowledgeMap {
  userId: string;
  areas: {
    areaId: string;
    proficiency: number; // 0-100
    confidence: number; // 0-100
    lastAssessed: string; // ISO date
    needsReview: boolean;
  }[];
}

// Assessment Results Types
export interface QuestionResult {
  questionId: string;
  correct: boolean;
  userAnswer: any;
  timeTaken?: number; // in seconds
  difficulty: QuestionDifficulty;
  knowledgeAreaId?: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  assessmentId: string;
  score: number; // percentage
  timeTaken: number; // in seconds
  completedAt: string; // ISO date
  questionResults: QuestionResult[];
  knowledgeGaps: {
    areaId: string;
    name: string;
    proficiency: number;
    recommendedResources?: {
      id: string;
      title: string;
      type: 'article' | 'video' | 'exercise';
      url: string;
    }[];
  }[];
}

// Assessment Interface Props
export interface AssessmentInterfaceProps {
  assessment: Assessment;
  onSubmit?: (answers: Record<string, any>) => void;
  onComplete?: (result: AssessmentResult) => void;
  className?: string;
}

// Assessment Results Visualization Props
export interface AssessmentResultsProps {
  result: AssessmentResult;
  showRecommendations?: boolean;
  className?: string;
}

// Knowledge Map Visualization Props
export interface KnowledgeMapProps {
  userKnowledgeMap: UserKnowledgeMap;
  showGaps?: boolean;
  className?: string;
}
