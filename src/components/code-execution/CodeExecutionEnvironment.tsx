'use client';

import { useState } from 'react';
import { CodeEditor } from '@/components/core';
import { LanguageSelector } from './LanguageSelector';
import { InputPanel } from './InputPanel';
import { OutputPanel } from './OutputPanel';
import { Button } from '@/components/ui/button';
import { useCodeExecutionStore } from '@/store/code-execution-store';
import { cn } from '@/lib/utils';
import { Play, RotateCcw, Save, Clock, History } from 'lucide-react';
import { PistonExecuteResponse } from '@/lib/code-execution';

interface CodeExecutionEnvironmentProps {
  className?: string;
  height?: string;
  onSave?: (code: string, language: string) => void;
}

export function CodeExecutionEnvironment({
  className,
  height = '400px',
  onSave
}: CodeExecutionEnvironmentProps) {
  // Get state from the store
  const {
    code,
    setCode,
    language,
    setLanguage,
    input,
    setInput,
    args,
    setArgs,
    isExecuting,
    setIsExecuting,
    executionResult,
    setExecutionResult,
    error,
    setError,
    resetCode,
    addToHistory
  } = useCodeExecutionStore();
  
  // Execute the code
  const handleExecute = async () => {
    try {
      setIsExecuting(true);
      setError(null);
      
      const response = await fetch('/api/code-execution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          language,
          code,
          input,
          args
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to execute code');
      }
      
      const result: PistonExecuteResponse = await response.json();
      setExecutionResult(result);
      
      // Add to history if successful
      addToHistory({
        language,
        code,
        input,
        args,
        result
      });
    } catch (err) {
      console.error('Error executing code:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsExecuting(false);
    }
  };
  
  // Clear the output
  const handleClearOutput = () => {
    setExecutionResult(null);
    setError(null);
  };
  
  // Handle save button click
  const handleSave = () => {
    if (onSave) {
      onSave(code, language);
    }
  };
  
  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <div className="flex flex-col sm:flex-row gap-4">
        <LanguageSelector
          value={language}
          onChange={setLanguage}
          className="w-full sm:w-64"
        />
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            onClick={resetCode}
            disabled={isExecuting}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          {onSave && (
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isExecuting}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
          <Button
            onClick={handleExecute}
            disabled={isExecuting || !code.trim()}
          >
            {isExecuting ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-4">
          <CodeEditor
            value={code}
            onChange={(value) => setCode(value || '')}
            language={language}
            height={height}
            readOnly={isExecuting}
          />
          <InputPanel
            input={input}
            onInputChange={setInput}
            args={args}
            onArgsChange={setArgs}
            className="flex-grow"
          />
        </div>
        <OutputPanel
          result={executionResult}
          error={error}
          isExecuting={isExecuting}
          onClear={handleClearOutput}
          className="h-full"
        />
      </div>
    </div>
  );
}
