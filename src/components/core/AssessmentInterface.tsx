"use client";

import { useState } from "react";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeEditor } from "./CodeEditor";
import { AssessmentInterfaceProps, Question } from "@/types/core-components";

export function AssessmentInterface({
  questions,
  onSubmit,
  onComplete,
  className,
}: AssessmentInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(answers);
    }

    // Calculate score
    let correctCount = 0;
    questions.forEach((question) => {
      const userAnswer = answers[question.id];
      
      if (question.type === "multiple-choice") {
        if (Array.isArray(question.correctAnswer)) {
          // Multiple correct answers
          if (Array.isArray(userAnswer) && 
              question.correctAnswer.length === userAnswer.length && 
              question.correctAnswer.every(a => userAnswer.includes(a))) {
            correctCount++;
          }
        } else {
          // Single correct answer
          if (userAnswer === question.correctAnswer) {
            correctCount++;
          }
        }
      } else if (question.type === "text") {
        // Simple string comparison for text answers
        if (userAnswer === question.correctAnswer) {
          correctCount++;
        }
      }
      // For coding questions, we would need a more complex evaluation
    });

    setScore(correctCount);
    setSubmitted(true);

    if (onComplete) {
      onComplete(correctCount, questions.length);
    }
  };

  const renderQuestion = (question: Question) => {
    const userAnswer = answers[question.id];
    const isCorrect = submitted && (
      question.type === "multiple-choice" ? 
        (Array.isArray(question.correctAnswer) ? 
          Array.isArray(userAnswer) && 
          question.correctAnswer.length === userAnswer.length && 
          question.correctAnswer.every(a => userAnswer.includes(a)) : 
          userAnswer === question.correctAnswer) :
        userAnswer === question.correctAnswer
    );

    return (
      <div className="space-y-4">
        <div className="text-lg font-medium">{question.prompt}</div>
        
        {question.type === "multiple-choice" && (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type={Array.isArray(question.correctAnswer) ? "checkbox" : "radio"}
                  id={`${question.id}-option-${index}`}
                  name={question.id}
                  value={option}
                  checked={
                    Array.isArray(userAnswer)
                      ? userAnswer.includes(option)
                      : userAnswer === option
                  }
                  onChange={(e) => {
                    if (Array.isArray(question.correctAnswer)) {
                      // Handle multiple selection
                      const newAnswers = e.target.checked
                        ? [...(Array.isArray(userAnswer) ? userAnswer : []), option]
                        : (Array.isArray(userAnswer) ? userAnswer.filter(a => a !== option) : []);
                      handleAnswerChange(question.id, newAnswers);
                    } else {
                      // Handle single selection
                      handleAnswerChange(question.id, option);
                    }
                  }}
                  disabled={submitted}
                  className="h-4 w-4"
                />
                <label
                  htmlFor={`${question.id}-option-${index}`}
                  className="text-sm"
                >
                  {option}
                </label>
                {submitted && (
                  Array.isArray(question.correctAnswer) ? 
                    (question.correctAnswer.includes(option) && (
                      <Check className="h-4 w-4 text-green-500" />
                    )) : 
                    (option === question.correctAnswer && (
                      <Check className="h-4 w-4 text-green-500" />
                    ))
                )}
              </div>
            ))}
          </div>
        )}

        {question.type === "text" && (
          <div>
            <input
              type="text"
              value={userAnswer || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              disabled={submitted}
              className="w-full p-2 border border-border rounded-md bg-background"
            />
            {submitted && (
              <div className="mt-2">
                <div className={cn(
                  "text-sm",
                  isCorrect ? "text-green-500" : "text-red-500"
                )}>
                  {isCorrect ? (
                    <span className="flex items-center">
                      <Check className="h-4 w-4 mr-1" /> Correct
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <X className="h-4 w-4 mr-1" /> Incorrect. Correct answer: {question.correctAnswer}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {question.type === "coding" && (
          <div>
            <CodeEditor
              value={userAnswer || question.code || ""}
              onChange={(value) => handleAnswerChange(question.id, value)}
              language={question.language || "javascript"}
              readOnly={submitted}
              height="200px"
            />
          </div>
        )}

        {submitted && question.explanation && (
          <div className="mt-4 p-3 bg-secondary/30 rounded-md">
            <div className="font-medium mb-1">Explanation:</div>
            <div className="text-sm">{question.explanation}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("border border-border rounded-md overflow-hidden", className)}>
      <div className="bg-card px-4 py-2 border-b border-border flex justify-between items-center">
        <h3 className="text-sm font-medium">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h3>
        {submitted && (
          <div className="text-sm">
            Score: <span className="font-medium">{score}/{questions.length}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {renderQuestion(currentQuestion)}
      </div>
      
      <div className="bg-card px-4 py-2 border-t border-border flex justify-between">
        <button
          type="button"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={cn(
            "flex items-center text-sm px-3 py-1 rounded-md",
            currentQuestionIndex === 0 
              ? "text-muted-foreground cursor-not-allowed" 
              : "hover:bg-secondary/50"
          )}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </button>
        
        <div>
          {!submitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Try Again
            </button>
          )}
        </div>
        
        <button
          type="button"
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className={cn(
            "flex items-center text-sm px-3 py-1 rounded-md",
            currentQuestionIndex === questions.length - 1 
              ? "text-muted-foreground cursor-not-allowed" 
              : "hover:bg-secondary/50"
          )}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
