'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, BookOpen, Clock, Calendar } from 'lucide-react';

interface StudyPlanGeneratorProps {
  userId: string;
}

export function StudyPlanGenerator({ userId }: StudyPlanGeneratorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTime, setAvailableTime] = useState(10); // Default: 10 hours per week
  const [preferences, setPreferences] = useState({
    preferVideo: false,
    preferInteractive: true,
    preferMorningStudy: false,
    preferWeekendStudy: true,
    focusOnWeakAreas: true
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/study-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          available_time: availableTime,
          preferences
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate study plan');
      }

      const data = await response.json();

      // Redirect to the study plan page
      router.push(`/dashboard/study-plans/${data.id}`);
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
          <BookOpen className="h-5 w-5" />
          Generate Study Plan
        </CardTitle>
        <CardDescription>
          Our AI will analyze your assessment results and create a customized study plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 py-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="available-time">Study Time (hours/week)</Label>
            <span className="font-medium">{availableTime} hours</span>
          </div>
          <Slider
            id="available-time"
            min={1}
            max={40}
            step={1}
            value={[availableTime]}
            onValueChange={(value) => setAvailableTime(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-muted-foreground">
            <span>1h</span>
            <span>20h</span>
            <span>40h</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Learning Preferences</Label>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="prefer-video"
              checked={preferences.preferVideo}
              onCheckedChange={(checked) =>
                setPreferences({...preferences, preferVideo: checked === true})
              }
            />
            <Label htmlFor="prefer-video" className="cursor-pointer">Video content</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="prefer-interactive"
              checked={preferences.preferInteractive}
              onCheckedChange={(checked) =>
                setPreferences({...preferences, preferInteractive: checked === true})
              }
            />
            <Label htmlFor="prefer-interactive" className="cursor-pointer">Interactive exercises</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="focus-weak"
              checked={preferences.focusOnWeakAreas}
              onCheckedChange={(checked) =>
                setPreferences({...preferences, focusOnWeakAreas: checked === true})
              }
            />
            <Label htmlFor="focus-weak" className="cursor-pointer">Focus on weak areas</Label>
          </div>
        </div>

        {error && (
          <div className="text-sm font-medium text-destructive">{error}</div>
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
              <Calendar className="mr-2 h-4 w-4" />
              Generate Plan
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
