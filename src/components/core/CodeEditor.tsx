"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import { CodeEditorProps } from "@/types/core-components";

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  readOnly = false,
  height = "300px",
  theme = "vs-dark",
  options = {},
  ...props
}: CodeEditorProps) {
  const [mounted, setMounted] = useState(false);

  // Default editor options
  const defaultOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbers: "on",
    readOnly,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: "on",
    ...options,
  };

  // Handle client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "border border-border rounded-md bg-card text-card-foreground",
          "flex items-center justify-center"
        )}
        style={{ height }}
      >
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={value}
        theme={theme}
        options={defaultOptions}
        onChange={onChange}
        loading={<p className="p-4 text-muted-foreground">Loading editor...</p>}
        {...props}
      />
    </div>
  );
}
