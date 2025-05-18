"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, File, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { TreeItem } from "@/types/core-components";

interface TopicExplorerProps {
  data: TreeItem[];
  onSelect?: (item: TreeItem) => void;
  className?: string;
  defaultExpandedFolders?: string[];
}

export function TopicExplorer({
  data,
  onSelect,
  className,
  defaultExpandedFolders = [],
}: TopicExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>(
    defaultExpandedFolders.reduce((acc, id) => ({ ...acc, [id]: true }), {})
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleItemSelect = (item: TreeItem) => {
    if (item.type === "file") {
      setSelectedItem(item.id);
      if (onSelect) {
        onSelect(item);
      }
    }
  };

  const renderTreeItem = (item: TreeItem, level = 0) => {
    const isExpanded = expandedFolders[item.id];
    const isSelected = selectedItem === item.id;
    const paddingLeft = level * 12 + 8;

    if (item.type === "folder") {
      return (
        <div key={item.id}>
          <div
            className="flex items-center py-1 px-2 hover:bg-secondary/50 cursor-pointer rounded-md transition-colors"
            style={{ paddingLeft: `${paddingLeft}px` }}
            onClick={() => toggleFolder(item.id)}
            role="button"
            aria-expanded={isExpanded}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                toggleFolder(item.id);
                e.preventDefault();
              }
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
            )}
            <Folder className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm">{item.name}</span>
          </div>
          {isExpanded && item.children && (
            <div>
              {item.children.map((child) => renderTreeItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          key={item.id}
          className={cn(
            "flex items-center py-1 px-2 hover:bg-secondary/50 cursor-pointer rounded-md transition-colors",
            isSelected && "bg-secondary"
          )}
          style={{ paddingLeft: `${paddingLeft + 20}px` }}
          onClick={() => handleItemSelect(item)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleItemSelect(item);
              e.preventDefault();
            }
          }}
        >
          {item.language === "code" ? (
            <Code className="h-4 w-4 mr-2 text-green-500" />
          ) : (
            <File className="h-4 w-4 mr-2 text-muted-foreground" />
          )}
          <span className="text-sm">{item.name}</span>
        </div>
      );
    }
  };

  return (
    <div className={cn("overflow-y-auto", className)}>
      {data.map((item) => renderTreeItem(item))}
    </div>
  );
}
