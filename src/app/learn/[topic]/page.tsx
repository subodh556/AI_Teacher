"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  BookOpen,
  Code,
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CodeExecutionEnvironment } from "@/components/code-execution";
import { mockTopicExplorerData } from "@/lib/mock-data";
import { TreeItem } from "@/types/core-components";

// Mock function to fetch topic content
const fetchTopicContent = async (topicId: string) => {
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

  // Generate mock content based on the topic
  return {
    id: topicId,
    name: topic?.name || "Unknown Topic",
    description: `Learn about ${topic?.name || "this topic"} with interactive examples and exercises.`,
    content: `
# ${topic?.name || "Topic Content"}

This is the learning content for ${topic?.name || "this topic"}. In a real application, this would be comprehensive educational material with text, images, and interactive elements.

## Key Concepts

1. First key concept of ${topic?.name || "this topic"}
2. Second key concept with examples
3. Practical applications

## Example Code

\`\`\`javascript
// Example code for ${topic?.name || "this topic"}
function example() {
  console.log("This is an example for ${topic?.name || "this topic"}");

  // Implementation details would go here
  return "Example result";
}
\`\`\`

## Practice Exercises

After studying this material, try the practice exercises to test your understanding.
    `,
    codeExample: `// Example code for ${topic?.name || "this topic"}
function example() {
  console.log("This is an example for ${topic?.name || "this topic"}");

  // Implementation details would go here
  return "Example result";
}

// Try modifying this code to see how it works
`,
    progress: Math.floor(Math.random() * 100),
    relatedTopics: [
      { id: "sorting", name: "Sorting Algorithms" },
      { id: "searching", name: "Searching Algorithms" },
      { id: "dynamic-programming", name: "Dynamic Programming" },
    ].filter(t => t.id !== topicId).slice(0, 2),
  };
};

export default function TopicPage() {
  const params = useParams();
  const topicId = params.topic as string;
  const [code, setCode] = useState("");

  // Fetch topic content
  const { data: topic, isLoading } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: () => fetchTopicContent(topicId),
    onSuccess: (data) => {
      setCode(data.codeExample);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <h2 className="text-2xl font-bold mb-4">Topic Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The topic you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/dashboard">
            Return to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

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
        <span className="text-foreground">{topic.name}</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{topic.name}</h1>
          <p className="text-muted-foreground">{topic.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground mr-2">Progress: {topic.progress}%</div>
          <Progress value={topic.progress} className="w-32 h-2" />
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="mb-6">
          <TabsTrigger value="content">
            <BookOpen className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="practice">
            <Code className="h-4 w-4 mr-2" />
            Practice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: topic.content.replace(/\n/g, '<br />') }} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/practice/${topicId}`}>
                  Practice Exercises
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {topic.relatedTopics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Related Topics</CardTitle>
                <CardDescription>Explore these related topics to deepen your understanding</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topic.relatedTopics.map((relatedTopic) => (
                  <Card key={relatedTopic.id} className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{relatedTopic.name}</CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/learn/${relatedTopic.id}`}>
                          Explore Topic
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Code Practice</CardTitle>
              <CardDescription>Try modifying the code and run it to see the results</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExecutionEnvironment height="300px" />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button asChild>
                <Link href={`/assessment/${topicId}`}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Take Assessment
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
