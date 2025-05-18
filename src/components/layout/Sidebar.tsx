"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight as ChevronRightIcon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderStructure, createComponentStructure, FolderItem, FileItem } from "./FolderStructure";
import { AIToolModal } from "@/components/ai/AIToolModal";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const { userId: clerkUserId } = useAuth();
  const [activeAITool, setActiveAITool] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for testing
  const mockUserId = "user-123"; // Use this mock ID for testing
  const mockTopicId = "topic-123";
  const mockTopicName = "JavaScript Fundamentals";

  // Use the Clerk user ID if available, otherwise use the mock ID
  const userId = clerkUserId || mockUserId;

  // Handle opening a tool
  const handleOpenTool = (toolId: string) => {
    setActiveAITool(toolId);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optional: Clear the active tool when modal is closed
    // setActiveAITool(null);
  };

  // Get the component structure
  let componentStructure = createComponentStructure();

  // Find the AI Tools folder and update the onClick handlers
  const aiToolsFolder = componentStructure[0] as FolderItem;
  if (aiToolsFolder && aiToolsFolder.children) {
    // Update the Study Plan Generator onClick
    const studyPlanItem = aiToolsFolder.children.find(item => item.id === 'study-plan') as FileItem;
    if (studyPlanItem) {
      studyPlanItem.onClick = () => handleOpenTool('study-plan');
    }

    // Update the Ask AI onClick
    const askAIItem = aiToolsFolder.children.find(item => item.id === 'contextual-explanation') as FileItem;
    if (askAIItem) {
      askAIItem.onClick = () => handleOpenTool('ask-ai');
    }

    // Update the Quiz Generator onClick
    const quizItem = aiToolsFolder.children.find(item => item.id === 'quiz-generator') as FileItem;
    if (quizItem) {
      quizItem.onClick = () => handleOpenTool('quiz');
    }
  }

  return (
    <>
      <div
        className={cn(
          "h-full border-r border-border transition-all duration-300 bg-card",
          collapsed ? "w-12" : "w-70"
        )}
      >
        <div className="flex items-center justify-between p-2 border-b border-border">
          {!collapsed && (
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-blue-500" />
              <h3 className="text-sm font-medium">AI Tools</h3>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-secondary/50"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
        {!collapsed && (
          <ScrollArea className="h-[calc(100%-40px)]">
            <div className="p-2">
              <FolderStructure items={componentStructure} />
            </div>
          </ScrollArea>
        )}
      </div>

      {/* AI Tool Modal */}
      <AIToolModal
        toolId={activeAITool}
        userId={userId}
        topicId={mockTopicId}
        topicName={mockTopicName}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
