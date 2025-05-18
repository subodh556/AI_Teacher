"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeExecutionEnvironment } from "@/components/code-execution";

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const [activeTab, setActiveTab] = useState("content");

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === "assessment") {
      // Navigate to assessment page
      window.location.href = '/assessment';
    } else {
      setActiveTab(value);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6 bg-background">
      <div className="max-w-full mx-auto">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="code-editor">Code Editor</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            {children}
          </TabsContent>

          <TabsContent value="code-editor">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Code Execution Environment</h2>
              <p className="text-muted-foreground">
                Write, run, and test your code in multiple programming languages.
              </p>
              <CodeExecutionEnvironment height="400px" />
            </div>
          </TabsContent>

          {/* Assessment tab content is not needed as we redirect immediately */}
        </Tabs>
      </div>
    </div>
  );
}
