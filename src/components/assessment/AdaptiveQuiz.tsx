'use client';

import { useState, useEffect } from 'react';
import { 
  Check, X, ChevronLeft, ChevronRight, 
  Clock, AlertCircle, HelpCircle, Lightbulb 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CodeEditor } from '@/components/core/CodeEditor';
import { 
  Assessment, Question, QuestionResult, AssessmentResult, 
  QuestionDifficulty, MultipleChoiceQuestion, TextQuestion,
  CodingQuestion, ProblemSolvingQuestion
} from '@/types/assessment';

interface AdaptiveQuizProps {
  assessment: Assessment;
  userId: string;
  onComplete?: (result: AssessmentResult) => void;
  className?: string;
}

export function AdaptiveQuiz({
  assessment,
  userId,
  onComplete,
  className,
}: AdaptiveQuizProps) {
  // State for quiz progress
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState(Date.now());
  const [remainingTime, setRemainingTime] = useState(assessment.timeLimit ? assessment.timeLimit * 60 : null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // State for adaptive quiz
  const [questions, setQuestions] = useState<Question[]>(assessment.questions);
  const [currentDifficulty, setCurrentDifficulty] = useState<QuestionDifficulty>(3);
  const [knowledgeGaps, setKnowledgeGaps] = useState<string[]>([]);

  // Get current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Timer effect for the entire assessment
  useEffect(() => {
    if (!remainingTime || isSubmitted) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [remainingTime, isSubmitted]);
  
  // Effect to reset question start time when changing questions
  useEffect(() => {
    setCurrentQuestionStartTime(Date.now());
    setShowExplanation(false);
  }, [currentQuestionIndex]);
  
  // Format remaining time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle answer change
  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    // Record result for current question
    const timeTaken = Math.round((Date.now() - currentQuestionStartTime) / 1000);
    const userAnswer = answers[currentQuestion.id];
    const isCorrect = checkAnswer(currentQuestion, userAnswer);
    
    const result: QuestionResult = {
      questionId: currentQuestion.id,
      correct: isCorrect,
      userAnswer,
      timeTaken,
      difficulty: currentQuestion.difficulty,
      knowledgeAreaId: currentQuestion.knowledgeAreaId,
    };
    
    setQuestionResults(prev => [...prev, result]);
    
    // Update knowledge gaps
    if (!isCorrect && currentQuestion.knowledgeAreaId) {
      setKnowledgeGaps(prev => 
        prev.includes(currentQuestion.knowledgeAreaId!) 
          ? prev 
          : [...prev, currentQuestion.knowledgeAreaId!]
      );
    }
    
    // Adjust difficulty for adaptive quiz
    if (assessment.adaptive) {
      const newDifficulty = adjustDifficulty(currentDifficulty, isCorrect);
      setCurrentDifficulty(newDifficulty);
    }
    
    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitAssessment();
    }
  };
  
  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Check if answer is correct
  const checkAnswer = (question: Question, answer: any): boolean => {
    if (!answer) return false;
    
    switch (question.type) {
      case 'multiple-choice':
        const mcQuestion = question as MultipleChoiceQuestion;
        if (Array.isArray(mcQuestion.correctAnswer)) {
          // Multiple correct answers
          return Array.isArray(answer) && 
            mcQuestion.correctAnswer.length === answer.length && 
            mcQuestion.correctAnswer.every(a => answer.includes(a));
        } else {
          // Single correct answer
          return answer === mcQuestion.correctAnswer;
        }
      
      case 'text':
        const textQuestion = question as TextQuestion;
        if (textQuestion.caseSensitive) {
          return answer === textQuestion.correctAnswer;
        } else {
          const normalizedAnswer = answer.toLowerCase().trim();
          const normalizedCorrect = textQuestion.correctAnswer.toLowerCase().trim();
          
          if (textQuestion.acceptableAnswers?.length) {
            return normalizedAnswer === normalizedCorrect || 
              textQuestion.acceptableAnswers.some(a => 
                normalizedAnswer === a.toLowerCase().trim()
              );
          }
          
          return normalizedAnswer === normalizedCorrect;
        }
      
      case 'coding':
        // In a real implementation, this would run tests against the code
        // For now, we'll just check if the answer contains key elements
        const codingQuestion = question as CodingQuestion;
        return typeof answer === 'string' && 
          codingQuestion.testCases.every(test => 
            answer.includes(test.expectedOutput)
          );
      
      case 'problem-solving':
        // Check each step
        const psQuestion = question as ProblemSolvingQuestion;
        return typeof answer === 'object' && 
          psQuestion.steps.every(step => 
            answer[step.id] === step.correctAnswer
          );
      
      default:
        return false;
    }
  };
  
  // Adjust difficulty based on performance
  const adjustDifficulty = (
    currentDifficulty: QuestionDifficulty, 
    isCorrect: boolean
  ): QuestionDifficulty => {
    if (isCorrect) {
      // Increase difficulty if correct, but cap at 5
      return Math.min(5, currentDifficulty + 1) as QuestionDifficulty;
    } else {
      // Decrease difficulty if incorrect, but floor at 1
      return Math.max(1, currentDifficulty - 1) as QuestionDifficulty;
    }
  };
  
  // Submit the entire assessment
  const handleSubmitAssessment = () => {
    // Calculate final score
    const correctCount = questionResults.filter(r => r.correct).length;
    const score = Math.round((correctCount / questions.length) * 100);
    
    // Calculate total time taken
    const timeTaken = assessment.timeLimit 
      ? (assessment.timeLimit * 60) - (remainingTime || 0)
      : questionResults.reduce((sum, r) => sum + (r.timeTaken || 0), 0);
    
    // Create assessment result
    const result: AssessmentResult = {
      id: `result-${Date.now()}`,
      userId,
      assessmentId: assessment.id,
      score,
      timeTaken,
      completedAt: new Date().toISOString(),
      questionResults,
      knowledgeGaps: knowledgeGaps.map(areaId => ({
        areaId,
        name: `Knowledge Area ${areaId}`, // In a real app, fetch the actual name
        proficiency: 0, // Calculate based on performance
        recommendedResources: [
          {
            id: `resource-${areaId}-1`,
            title: `Resource for ${areaId}`,
            type: 'article',
            url: `/learn/${areaId}`,
          }
        ]
      })),
    };
    
    setIsSubmitted(true);
    
    if (onComplete) {
      onComplete(result);
    }
  };
  
  // Toggle explanation visibility
  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Quiz header with progress and timer */}
      <div className="flex justify-between items-center">
        <div className="text-sm">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        
        {remainingTime !== null && (
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {formatTime(remainingTime)}
          </div>
        )}
      </div>
      
      <Progress 
        value={((currentQuestionIndex + 1) / questions.length) * 100} 
        className="h-2" 
      />
      
      {/* Current question */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="font-medium">{currentQuestion.prompt}</div>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={toggleExplanation}
                      disabled={!currentQuestion.explanation}
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {showExplanation ? 'Hide explanation' : 'Show explanation'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="text-xs px-2 py-1 rounded-full bg-secondary">
                Difficulty: {currentQuestion.difficulty}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Render question based on type */}
          {renderQuestion(currentQuestion, answers[currentQuestion.id], handleAnswerChange)}
          
          {/* Explanation */}
          {showExplanation && currentQuestion.explanation && (
            <div className="mt-4 p-3 bg-secondary/30 rounded-md">
              <div className="flex items-center font-medium mb-1">
                <Lightbulb className="h-4 w-4 mr-1" />
                Explanation:
              </div>
              <div className="text-sm">{currentQuestion.explanation}</div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button onClick={handleNextQuestion}>
            {currentQuestionIndex < questions.length - 1 ? (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Helper function to render different question types
function renderQuestion(
  question: Question, 
  answer: any, 
  onChange: (id: string, value: any) => void
) {
  switch (question.type) {
    case 'multiple-choice':
      return renderMultipleChoiceQuestion(question as MultipleChoiceQuestion, answer, onChange);
    case 'text':
      return renderTextQuestion(question as TextQuestion, answer, onChange);
    case 'coding':
      return renderCodingQuestion(question as CodingQuestion, answer, onChange);
    case 'problem-solving':
      return renderProblemSolvingQuestion(question as ProblemSolvingQuestion, answer, onChange);
    default:
      return <div>Unsupported question type</div>;
  }
}

// Render multiple choice question
function renderMultipleChoiceQuestion(
  question: MultipleChoiceQuestion, 
  answer: string | string[], 
  onChange: (id: string, value: any) => void
) {
  const isMultipleSelect = Array.isArray(question.correctAnswer);
  
  return (
    <div className="space-y-2">
      {question.options.map(option => (
        <div 
          key={option.id}
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary/50 cursor-pointer"
          onClick={() => {
            if (isMultipleSelect) {
              // Handle multiple select
              const currentAnswers = Array.isArray(answer) ? answer : [];
              const newAnswers = currentAnswers.includes(option.id)
                ? currentAnswers.filter(id => id !== option.id)
                : [...currentAnswers, option.id];
              onChange(question.id, newAnswers);
            } else {
              // Handle single select
              onChange(question.id, option.id);
            }
          }}
        >
          <div className={cn(
            "w-5 h-5 rounded-sm border flex items-center justify-center",
            isMultipleSelect ? "rounded-sm" : "rounded-full",
            answer === option.id || (Array.isArray(answer) && answer.includes(option.id))
              ? "bg-primary border-primary text-primary-foreground"
              : "border-border"
          )}>
            {answer === option.id || (Array.isArray(answer) && answer.includes(option.id)) && (
              <Check className="h-3 w-3" />
            )}
          </div>
          <div>{option.text}</div>
        </div>
      ))}
    </div>
  );
}

// Render text question
function renderTextQuestion(
  question: TextQuestion, 
  answer: string, 
  onChange: (id: string, value: any) => void
) {
  return (
    <div>
      <input
        type="text"
        value={answer || ""}
        onChange={(e) => onChange(question.id, e.target.value)}
        className="w-full p-2 border border-border rounded-md bg-background"
        placeholder="Type your answer here..."
      />
    </div>
  );
}

// Render coding question
function renderCodingQuestion(
  question: CodingQuestion, 
  answer: string, 
  onChange: (id: string, value: any) => void
) {
  return (
    <div className="space-y-4">
      <CodeEditor
        value={answer || question.starterCode || ""}
        onChange={(value) => onChange(question.id, value)}
        language={question.language}
        height="200px"
      />
      
      <div className="text-sm">
        <div className="font-medium mb-1">Test Cases:</div>
        <div className="space-y-2">
          {question.testCases.map((test, index) => (
            <div key={index} className="p-2 bg-secondary/30 rounded-md">
              <div>Input: <code>{test.input}</code></div>
              <div>Expected Output: <code>{test.expectedOutput}</code></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Render problem solving question
function renderProblemSolvingQuestion(
  question: ProblemSolvingQuestion, 
  answer: Record<string, string>, 
  onChange: (id: string, value: any) => void
) {
  const currentAnswers = answer || {};
  
  return (
    <div className="space-y-4">
      {question.steps.map((step, index) => (
        <div key={step.id} className="space-y-2">
          <div className="font-medium">Step {index + 1}: {step.prompt}</div>
          
          <input
            type="text"
            value={currentAnswers[step.id] || ""}
            onChange={(e) => {
              const newAnswers = {
                ...currentAnswers,
                [step.id]: e.target.value
              };
              onChange(question.id, newAnswers);
            }}
            className="w-full p-2 border border-border rounded-md bg-background"
            placeholder="Type your answer here..."
          />
          
          {step.hint && (
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3 mr-1" />
              Hint: {step.hint}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
