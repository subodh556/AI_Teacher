'use client';

import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StudyPlanGenerator } from '@/components/ai/StudyPlanGenerator';
import { ContextualExplanation } from '@/components/ai/ContextualExplanation';
import { QuizGenerator } from '@/components/ai/QuizGenerator';
import { BookOpen, MessageSquare, ListChecks } from 'lucide-react';

interface AIToolModalProps {
  toolId: string | null;
  userId: string;
  topicId?: string;
  topicName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AIToolModal({
  toolId,
  userId,
  topicId = 'topic-123',
  topicName = 'JavaScript Fundamentals',
  isOpen,
  onClose
}: AIToolModalProps) {
  // Close the modal when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  // Get the title and icon based on the tool ID
  const getToolInfo = () => {
    switch (toolId) {
      case 'study-plan':
        return {
          title: 'Study Plan Generator',
          icon: <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
        };
      case 'ask-ai':
        return {
          title: 'Ask AI',
          icon: <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
        };
      case 'quiz':
        return {
          title: 'Quiz Generator',
          icon: <ListChecks className="h-5 w-5 mr-2 text-green-500" />
        };
      default:
        return {
          title: 'AI Tool',
          icon: null
        };
    }
  };

  const { title, icon } = getToolInfo();

  // Render the appropriate tool component
  const renderTool = () => {
    if (!toolId) return null;

    switch (toolId) {
      case 'study-plan':
        return <StudyPlanGenerator userId={userId} />;
      case 'ask-ai':
        return (
          <ContextualExplanation
            userId={userId}
            initialQuery="How can AI help me learn more effectively?"
          />
        );
      case 'quiz':
        return (
          <QuizGenerator
            userId={userId}
            topicId={topicId}
            topicName={topicName}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] md:max-w-[900px] lg:max-w-[1000px] w-[90vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="bg-secondary/30 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
          <DialogTitle className="flex items-center ai-tool-modal-title">
            <div className="bg-background p-2 rounded-full mr-3">
              {icon && React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6 mr-2" })}
            </div>
            {title}
          </DialogTitle>
          <p className="ai-tool-modal-description">
            {toolId === 'study-plan' && "Generate a personalized study plan based on your learning goals and preferences."}
            {toolId === 'ask-ai' && "Ask questions and get detailed explanations about any programming topic."}
            {toolId === 'quiz' && "Test your knowledge with automatically generated quizzes on various topics."}
          </p>
        </DialogHeader>
        <div className="mt-4 ai-tool-modal-content">
          {renderTool()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
