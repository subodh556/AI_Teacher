"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Terminal, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { TerminalInterface, OutputConsole } from "@/components/core";

interface BottomPanelProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function BottomPanel({ collapsed, setCollapsed }: BottomPanelProps) {
  const [activeTab, setActiveTab] = useState<"terminal" | "output">("terminal");
  const [output, setOutput] = useState<string[]>([
    "Welcome to AI Teacher Output Console",
    "Run code to see output here",
  ]);

  const handleTerminalCommand = (command: string) => {
    console.log("Terminal command:", command);

    // If the command is "run", simulate code execution and update output
    if (command === "run" || command.startsWith("run ")) {
      setOutput([
        "Running code...",
        "Found 7 at index: 3",
        "Execution completed successfully.",
      ]);
      setActiveTab("output");
    }
  };

  const handleClearOutput = () => {
    setOutput([]);
  };

  return (
    <div
      className={cn(
        "border-t border-border transition-all duration-300 bg-card",
        collapsed ? "h-10" : "h-64"
      )}
    >
      <div className="flex items-center justify-between p-2 border-b border-border">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab("terminal")}
            className={cn(
              "flex items-center text-sm",
              activeTab === "terminal" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Terminal className="h-4 w-4 mr-1" />
            <span>Terminal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("output")}
            className={cn(
              "flex items-center text-sm",
              activeTab === "output" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Terminal className="h-4 w-4 mr-1" />
            <span>Output</span>
          </button>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-secondary/50"
            aria-label={collapsed ? "Expand bottom panel" : "Collapse bottom panel"}
          >
            {collapsed ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-2 h-[calc(100%-40px)]">
          {activeTab === "terminal" ? (
            <TerminalInterface
              onCommand={handleTerminalCommand}
              height="100%"
            />
          ) : (
            <OutputConsole
              output={output}
              onClear={handleClearOutput}
              height="100%"
            />
          )}
        </div>
      )}
    </div>
  );
}
