"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TerminalInterface } from "@/components/core";
import { CodeExecutionEnvironment } from "@/components/code-execution";
import { mockTopicExplorerData } from "@/lib/mock-data";
import { TreeItem } from "@/types/core-components";

// Mock function to fetch practice exercises
const fetchPracticeExercises = async (topicId: string) => {
  // In a real app, this would be an API call
  // For now, we'll search the mock data
  const findTopic = (items: TreeItem[]): TreeItem | null => {
    for (const item of items) {
      if (item.id === topicId) {
        return item;
      }
      if (item.children) {
        const found = findTopic(item.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const topic = findTopic(mockTopicExplorerData);

  // Generate mock exercises based on the topic
  return {
    id: topicId,
    name: topic?.name || "Unknown Topic",
    description: `Practice exercises for ${topic?.name || "this topic"}.`,
    exercises: [
      {
        id: `${topicId}-ex1`,
        title: "Basic Implementation",
        description: `Implement a basic version of ${topic?.name || "the algorithm"}.`,
        difficulty: "Easy",
        starterCode: `// Exercise 1: Basic Implementation
// Implement a basic version of ${topic?.name || "the algorithm"}

function solution(input) {
  // Your code here

  return result;
}

// Test cases
console.log(solution([1, 2, 3, 4, 5])); // Expected output depends on the exercise
`,
        testCases: [
          { input: [1, 2, 3, 4, 5], expectedOutput: "Depends on exercise" },
          { input: [5, 4, 3, 2, 1], expectedOutput: "Depends on exercise" },
        ],
      },
      {
        id: `${topicId}-ex2`,
        title: "Advanced Implementation",
        description: `Implement an optimized version of ${topic?.name || "the algorithm"}.`,
        difficulty: "Medium",
        starterCode: `// Exercise 2: Advanced Implementation
// Implement an optimized version of ${topic?.name || "the algorithm"}

function solution(input) {
  // Your code here

  return result;
}

// Test cases
console.log(solution([1, 2, 3, 4, 5])); // Expected output depends on the exercise
`,
        testCases: [
          { input: [1, 2, 3, 4, 5], expectedOutput: "Depends on exercise" },
          { input: [5, 4, 3, 2, 1], expectedOutput: "Depends on exercise" },
        ],
      },
    ],
  };
};

export default function PracticePage() {
  const params = useParams();
  const topicId = params.topic as string;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string[]>([]);

  // Fetch practice exercises
  const { data: practiceData, isLoading } = useQuery({
    queryKey: ['practice', topicId],
    queryFn: () => fetchPracticeExercises(topicId),
    onSuccess: (data) => {
      if (data.exercises.length > 0) {
        setCode(data.exercises[0].starterCode);
      }
    },
  });

  const handleRunCode = () => {
    setOutput([
      "Running code...",
      "Test case 1: Passed",
      "Test case 2: Failed - Expected output doesn't match",
      "1 of 2 tests passed",
    ]);
  };

  const handleResetCode = () => {
    if (practiceData?.exercises[currentExerciseIndex]) {
      setCode(practiceData.exercises[currentExerciseIndex].starterCode);
      setOutput([]);
    }
  };

  const handleTerminalCommand = (command: string) => {
    if (command === "run") {
      handleRunCode();
    } else if (command === "reset") {
      handleResetCode();
    } else {
      setOutput(prev => [...prev, `Command not recognized: ${command}`]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading practice exercises...</p>
        </div>
      </div>
    );
  }

  if (!practiceData || practiceData.exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <h2 className="text-2xl font-bold mb-4">No Practice Exercises Found</h2>
        <p className="text-muted-foreground mb-6">
          There are no practice exercises available for this topic yet.
        </p>
        <Button asChild>
          <Link href={`/learn/${topicId}`}>
            Return to Learning Content
          </Link>
        </Button>
      </div>
    );
  }

  const currentExercise = practiceData.exercises[currentExerciseIndex];

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link href="/learn" className="hover:text-foreground">
          Learn
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link href={`/learn/${topicId}`} className="hover:text-foreground">
          {practiceData.name}
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground">Practice</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Practice: {practiceData.name}</h1>
          <p className="text-muted-foreground">{practiceData.description}</p>
        </div>
      </div>

      <Tabs defaultValue="exercise" className="space-y-6">
        <TabsList>
          <TabsTrigger value="exercise">Exercise</TabsTrigger>
          <TabsTrigger value="terminal">Terminal</TabsTrigger>
        </TabsList>

        <TabsContent value="exercise">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>{currentExercise.title}</CardTitle>
                <CardDescription>
                  Difficulty: <span className={
                    currentExercise.difficulty === "Easy" ? "text-green-500" :
                    currentExercise.difficulty === "Medium" ? "text-yellow-500" : "text-red-500"
                  }>{currentExercise.difficulty}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{currentExercise.description}</p>
                <div className="space-y-4">
                  <h4 className="font-medium">Test Cases:</h4>
                  <div className="space-y-2">
                    {currentExercise.testCases.map((testCase, index) => (
                      <div key={index} className="text-sm p-2 bg-secondary/30 rounded-md">
                        <div><span className="font-mono">Input:</span> {JSON.stringify(testCase.input)}</div>
                        <div><span className="font-mono">Expected:</span> {testCase.expectedOutput}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentExerciseIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentExerciseIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentExerciseIndex(prev => Math.min(practiceData.exercises.length - 1, prev + 1))}
                  disabled={currentExerciseIndex === practiceData.exercises.length - 1}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Code Execution Environment</CardTitle>
                <CardDescription>Write your solution and run it to test</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-full">
                  {/* Use the new CodeExecutionEnvironment component */}
                  <CodeExecutionEnvironment
                    height="400px"
                    onSave={(savedCode, language) => {
                      // Handle saving code if needed
                      console.log("Saving code:", savedCode, language);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" asChild>
              <Link href={`/learn/${topicId}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Back to Learning
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/assessment/${topicId}`}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Take Assessment
              </Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="terminal">
          <Card>
            <CardHeader>
              <CardTitle>Terminal Interface</CardTitle>
              <CardDescription>Use commands like 'run' and 'reset' to interact with your code</CardDescription>
            </CardHeader>
            <CardContent>
              <TerminalInterface
                onCommand={handleTerminalCommand}
                initialCommands={[
                  "Welcome to the Practice Terminal",
                  "Type 'run' to execute your code",
                  "Type 'reset' to reset your code to the starter template",
                ]}
                height="400px"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
