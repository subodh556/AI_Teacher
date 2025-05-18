'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputPanelProps {
  input: string;
  onInputChange: (input: string) => void;
  args: string[];
  onArgsChange: (args: string[]) => void;
  className?: string;
}

export function InputPanel({
  input,
  onInputChange,
  args,
  onArgsChange,
  className
}: InputPanelProps) {
  const [activeTab, setActiveTab] = useState<string>('stdin');
  const [newArg, setNewArg] = useState<string>('');
  
  // Handle adding a new argument
  const handleAddArg = () => {
    if (newArg.trim()) {
      onArgsChange([...args, newArg.trim()]);
      setNewArg('');
    }
  };
  
  // Handle removing an argument
  const handleRemoveArg = (index: number) => {
    const newArgs = [...args];
    newArgs.splice(index, 1);
    onArgsChange(newArgs);
  };
  
  // Handle pressing Enter in the new argument input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddArg();
    }
  };
  
  return (
    <div className={cn("border rounded-md", className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <h3 className="text-sm font-medium">Input</h3>
          <TabsList className="h-8">
            <TabsTrigger value="stdin" className="text-xs h-7">
              Standard Input
            </TabsTrigger>
            <TabsTrigger value="args" className="text-xs h-7">
              Command Line Args
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="stdin" className="p-3">
          <Textarea
            placeholder="Enter input for your program..."
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            className="min-h-[100px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-2">
            This input will be passed to your program's standard input (stdin).
          </p>
        </TabsContent>
        
        <TabsContent value="args" className="p-3">
          <div className="space-y-3">
            {args.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {args.map((arg, index) => (
                  <div 
                    key={index}
                    className="flex items-center bg-secondary rounded-md px-2 py-1"
                  >
                    <span className="text-sm font-mono mr-1">{arg}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => handleRemoveArg(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No command line arguments added yet.
              </p>
            )}
            
            <div className="flex gap-2">
              <Input
                placeholder="Add argument..."
                value={newArg}
                onChange={(e) => setNewArg(e.target.value)}
                onKeyDown={handleKeyDown}
                className="font-mono text-sm"
              />
              <Button 
                size="sm" 
                onClick={handleAddArg}
                disabled={!newArg.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              These arguments will be passed to your program as command line arguments.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
