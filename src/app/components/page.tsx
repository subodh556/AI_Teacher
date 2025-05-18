"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TopicExplorer,
  TerminalInterface,
  OutputConsole,
  AssessmentInterface,
  ProgressDashboard,
} from "@/components/core";
import { CodeExecutionEnvironment } from "@/components/code-execution";
import {
  mockTopicExplorerData,
  mockOutputConsoleData,
  mockAssessmentQuestions,
  mockProgressData,
  mockAchievements,
} from "@/lib/mock-data";
import { TreeItem } from "@/types/core-components";

export default function ComponentsPage() {
  const [selectedTopic, setSelectedTopic] = useState<TreeItem | null>(null);
  const [output, setOutput] = useState(mockOutputConsoleData);

  const handleTopicSelect = (item: TreeItem) => {
    setSelectedTopic(item);
    console.log("Selected topic:", item);
  };

  const handleTerminalCommand = (command: string) => {
    console.log("Terminal command:", command);

    // Simulate running code
    if (command === "run") {
      setOutput([
        "Running code...",
        "Found 7 at index: 3",
        "Execution completed successfully.",
      ]);
    }
  };

  const handleClearOutput = () => {
    setOutput([]);
  };

  const handleAssessmentSubmit = (answers: Record<string, any>) => {
    console.log("Assessment answers:", answers);
  };

  const handleAssessmentComplete = (score: number, total: number) => {
    console.log(`Assessment completed: ${score}/${total}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Core UI Components</h1>

      <Tabs defaultValue="topic-explorer" className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="topic-explorer">Topic Explorer</TabsTrigger>
          <TabsTrigger value="code-editor">Code Editor</TabsTrigger>
          <TabsTrigger value="terminal">Terminal</TabsTrigger>
          <TabsTrigger value="output">Output Console</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="progress">Progress Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="topic-explorer" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Topic Explorer</h2>
          <p className="text-muted-foreground mb-6">
            File-tree style navigation organized by CS domains.
          </p>
          <div className="border border-border rounded-md p-4 h-96">
            <TopicExplorer
              data={mockTopicExplorerData}
              onSelect={handleTopicSelect}
              defaultExpandedFolders={["algorithms"]}
            />
          </div>
          {selectedTopic && (
            <div className="mt-4 p-4 border border-border rounded-md">
              <h3 className="font-medium">Selected Topic:</h3>
              <pre className="mt-2 p-2 bg-secondary/30 rounded-md overflow-x-auto">
                {JSON.stringify(selectedTopic, null, 2)}
              </pre>
            </div>
          )}
        </TabsContent>

        <TabsContent value="code-editor" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Code Execution Environment</h2>
          <p className="text-muted-foreground mb-6">
            Write, run, and test your code in multiple programming languages.
          </p>
          <CodeExecutionEnvironment height="400px" />
        </TabsContent>

        <TabsContent value="terminal" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Terminal Interface</h2>
          <p className="text-muted-foreground mb-6">
            Command-line environment for executing code and navigating the platform.
            Try commands like: help, clear, echo hello, date, run
          </p>
          <TerminalInterface
            onCommand={handleTerminalCommand}
            height="400px"
          />
        </TabsContent>

        <TabsContent value="output" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Output Console</h2>
          <p className="text-muted-foreground mb-6">
            Area displaying results of code execution and system feedback.
          </p>
          <OutputConsole
            output={output}
            onClear={handleClearOutput}
            height="400px"
          />
        </TabsContent>

        <TabsContent value="assessment" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Assessment Interface</h2>
          <p className="text-muted-foreground mb-6">
            Integrated quiz system with adaptive difficulty controls.
          </p>
          <AssessmentInterface
            questions={mockAssessmentQuestions}
            onSubmit={handleAssessmentSubmit}
            onComplete={handleAssessmentComplete}
          />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Progress Dashboard</h2>
          <p className="text-muted-foreground mb-6">
            GitHub-style contribution graph showing learning activity.
          </p>
          <ProgressDashboard
            progressData={mockProgressData}
            achievements={mockAchievements}
            streakCount={12}
            completedToday={3}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
