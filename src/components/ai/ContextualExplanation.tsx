'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Search, Lightbulb, BookOpen, ExternalLink } from 'lucide-react';

interface ContextualExplanationProps {
  userId: string;
  contentId?: string;
  questionId?: string;
  initialQuery?: string;
}

interface Source {
  id: string;
  title: string;
  source: string;
}

export function ContextualExplanation({
  userId,
  contentId,
  questionId,
  initialQuery = ''
}: ContextualExplanationProps) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<{
    title: string;
    explanation: string;
    sources: Source[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/explanations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          content_id: contentId,
          question_id: questionId,
          query
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate explanation');
      }

      const data = await response.json();
      setExplanation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 h-10"
          />
          <Button type="submit" disabled={loading} className="h-10 px-3">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
        {error && (
          <div className="font-medium text-destructive">{error}</div>
        )}
      </form>

      {explanation && (
        <Card>
          <CardHeader className="px-4 py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-5 w-5" />
              {explanation.title.length > 40
                ? explanation.title.substring(0, 40) + '...'
                : explanation.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2">
            <Tabs defaultValue="explanation">
              <TabsList className="mb-2 h-10">
                <TabsTrigger value="explanation">Explanation</TabsTrigger>
                <TabsTrigger value="sources">Sources ({explanation.sources.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="explanation">
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {explanation.explanation.split('\n').map((paragraph, i) => (
                    paragraph ? <p key={i} className="mb-1">{paragraph}</p> : null
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sources">
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {explanation.sources.map((source, index) => (
                    <div key={index} className="border rounded-md p-2">
                      <div className="font-medium flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {source.title.length > 30
                          ? source.title.substring(0, 30) + '...'
                          : source.title}
                      </div>
                      <div className="text-muted-foreground mt-1">
                        {source.source}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
