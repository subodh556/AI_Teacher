'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, BrainCircuit, ListChecks } from 'lucide-react';

interface QuizGeneratorProps {
  userId: string;
  topicId: string;
  topicName: string;
}

export function QuizGenerator({ userId, topicId, topicName }: QuizGeneratorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [difficultyLevel, setDifficultyLevel] = useState<number | null>(null);
  const [questionTypes, setQuestionTypes] = useState({
    multipleChoice: true,
    shortAnswer: true,
    coding: false
  });

  const handleSubmit = async () => {
    // Ensure at least one question type is selected
    if (!questionTypes.multipleChoice && !questionTypes.shortAnswer && !questionTypes.coding) {
      setError('Please select at least one question type');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert question types to array format expected by API
      const selectedQuestionTypes = [];
      if (questionTypes.multipleChoice) selectedQuestionTypes.push('multiple-choice');
      if (questionTypes.shortAnswer) selectedQuestionTypes.push('short-answer');
      if (questionTypes.coding) selectedQuestionTypes.push('coding');

      const response = await fetch('/api/ai/quiz-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          topic_id: topicId,
          question_types: selectedQuestionTypes,
          number_of_questions: numberOfQuestions,
          difficulty_level: difficultyLevel
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const data = await response.json();

      // Redirect to the assessment page
      router.push(`/assessment/${data.assessment_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BrainCircuit className="h-5 w-5" />
          Generate Quiz
        </CardTitle>
        <CardDescription>
          Create a personalized quiz for {topicName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 py-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="num-questions">Number of Questions</Label>
            <span className="font-medium">{numberOfQuestions}</span>
          </div>
          <Slider
            id="num-questions"
            min={1}
            max={20}
            step={1}
            value={[numberOfQuestions]}
            onValueChange={(value) => setNumberOfQuestions(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-muted-foreground">
            <span>1</span>
            <span>10</span>
            <span>20</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select
            value={difficultyLevel?.toString() || 'auto'}
            onValueChange={(value) => {
              if (value === 'auto') {
                setDifficultyLevel(null);
              } else {
                setDifficultyLevel(parseInt(value));
              }
            }}
          >
            <SelectTrigger id="difficulty" className="h-10">
              <SelectValue placeholder="Auto (based on progress)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto (based on progress)</SelectItem>
              <SelectItem value="1">Very Easy (1)</SelectItem>
              <SelectItem value="3">Medium (3)</SelectItem>
              <SelectItem value="5">Very Hard (5)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Question Types</Label>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="multiple-choice"
              checked={questionTypes.multipleChoice}
              onCheckedChange={(checked) =>
                setQuestionTypes({...questionTypes, multipleChoice: checked === true})
              }
            />
            <Label htmlFor="multiple-choice" className="cursor-pointer">Multiple Choice</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="short-answer"
              checked={questionTypes.shortAnswer}
              onCheckedChange={(checked) =>
                setQuestionTypes({...questionTypes, shortAnswer: checked === true})
              }
            />
            <Label htmlFor="short-answer" className="cursor-pointer">Short Answer</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="coding"
              checked={questionTypes.coding}
              onCheckedChange={(checked) =>
                setQuestionTypes({...questionTypes, coding: checked === true})
              }
            />
            <Label htmlFor="coding" className="cursor-pointer">Coding Questions</Label>
          </div>
        </div>

        {error && (
          <div className="font-medium text-destructive">{error}</div>
        )}
      </CardContent>
      <CardFooter className="px-4 py-3">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-10"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ListChecks className="mr-2 h-4 w-4" />
              Generate Quiz
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
