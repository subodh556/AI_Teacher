'use client';

import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PistonExecuteResponse } from '@/lib/code-execution';
import { cn } from '@/lib/utils';
import { Copy, Check, Clock, HardDrive, AlertCircle, X } from 'lucide-react';

interface OutputPanelProps {
  result: PistonExecuteResponse | null;
  error: string | null;
  isExecuting: boolean;
  onClear: () => void;
  className?: string;
}

export function OutputPanel({
  result,
  error,
  isExecuting,
  onClear,
  className
}: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<string>('output');
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [result, error]);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  // Handle copying output to clipboard
  const handleCopy = () => {
    if (!result) return;

    let textToCopy = '';

    if (activeTab === 'output') {
      textToCopy = result.run.stdout || '';
    } else if (activeTab === 'errors') {
      textToCopy = result.run.stderr || '';
      if (result.compile?.stderr) {
        textToCopy = result.compile.stderr + '\n' + textToCopy;
      }
    } else if (activeTab === 'details') {
      textToCopy = JSON.stringify(result, null, 2);
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
  };

  // Determine if there are any errors
  const hasErrors = Boolean(
    error ||
    (result?.run.stderr && result.run.stderr.length > 0) ||
    (result?.compile?.stderr && result.compile.stderr.length > 0) ||
    result?.run.code !== 0 ||
    result?.compile?.code !== 0
  );

  // Determine if there is any output
  const hasOutput = Boolean(
    result?.run.stdout && result.run.stdout.length > 0
  );

  return (
    <div className={cn("border rounded-md", className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <h3 className="text-sm font-medium">Output</h3>
          <div className="flex items-center gap-2">
            <TabsList className="h-8">
              <TabsTrigger value="output" className="text-xs h-7">
                Output
              </TabsTrigger>
              <TabsTrigger value="errors" className="text-xs h-7">
                Errors
                {hasErrors && (
                  <span className="ml-1 h-2 w-2 rounded-full bg-destructive"></span>
                )}
              </TabsTrigger>
              <TabsTrigger value="details" className="text-xs h-7">
                Details
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCopy}
                disabled={!result}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClear}
                disabled={!result && !error}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="output" className="p-0">
          <div
            ref={outputRef}
            className="h-[200px] overflow-auto p-3 font-mono text-sm whitespace-pre-wrap"
          >
            {isExecuting ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
                  <p className="text-sm text-muted-foreground">Executing code...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-destructive">{error}</div>
            ) : result ? (
              hasOutput ? (
                <div>{result.run.stdout}</div>
              ) : (
                <div className="text-muted-foreground italic">No output</div>
              )
            ) : (
              <div className="text-muted-foreground italic">Run your code to see output</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="errors" className="p-0">
          <div
            ref={outputRef}
            className="h-[200px] overflow-auto p-3 font-mono text-sm whitespace-pre-wrap"
          >
            {isExecuting ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
                  <p className="text-sm text-muted-foreground">Executing code...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-destructive">{error}</div>
            ) : result ? (
              <>
                {result.compile?.stderr && (
                  <div className="text-destructive mb-2">
                    <div className="font-semibold mb-1">Compilation Errors:</div>
                    {result.compile.stderr}
                  </div>
                )}
                {result.run.stderr ? (
                  <div className="text-destructive">
                    {result.compile?.stderr && <div className="font-semibold mb-1">Runtime Errors:</div>}
                    {result.run.stderr}
                  </div>
                ) : (
                  !result.compile?.stderr && (
                    <div className="text-muted-foreground italic">No errors</div>
                  )
                )}
              </>
            ) : (
              <div className="text-muted-foreground italic">Run your code to see errors</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="details" className="p-0">
          <div
            className="h-[200px] overflow-auto p-3 font-mono text-sm"
          >
            {isExecuting ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
                  <p className="text-sm text-muted-foreground">Executing code...</p>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">CPU Time: {result.run.cpu_time}ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Wall Time: {result.run.wall_time}ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Memory: {result.run.memory}KB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Exit Code: {result.run.code}</span>
                  </div>
                </div>

                {result.compile && (
                  <>
                    <div className="text-sm font-semibold mt-4">Compilation Details:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">CPU Time: {result.compile.cpu_time}ms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Wall Time: {result.compile.wall_time}ms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Memory: {result.compile.memory}KB</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Exit Code: {result.compile.code}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground italic">Run your code to see execution details</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
