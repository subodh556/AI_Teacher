"use client";

import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { OutputConsoleProps } from "@/types/core-components";

export function OutputConsole({
  output,
  onClear,
  height = "200px",
  className,
}: OutputConsoleProps) {
  const consoleRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div
      className={cn(
        "border border-border rounded-md overflow-hidden flex flex-col",
        className
      )}
      style={{ height }}
    >
      <div className="flex items-center justify-between bg-card px-3 py-1 border-b border-border">
        <h3 className="text-sm font-medium">Output Console</h3>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear console"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div
        ref={consoleRef}
        className="flex-1 overflow-y-auto p-3 bg-background font-mono text-sm whitespace-pre-wrap"
      >
        {output.length === 0 ? (
          <div className="text-muted-foreground italic">No output to display</div>
        ) : (
          output.map((line, index) => {
            // Check if line is an error message
            const isError = line.toLowerCase().includes("error");
            // Check if line is a warning message
            const isWarning = line.toLowerCase().includes("warning");
            // Check if line is a success message
            const isSuccess = line.toLowerCase().includes("success");

            return (
              <div
                key={index}
                className={cn(
                  "mb-1",
                  isError && "text-red-500",
                  isWarning && "text-yellow-500",
                  isSuccess && "text-green-500"
                )}
              >
                {line}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
