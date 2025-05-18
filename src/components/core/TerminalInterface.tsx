"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TerminalInterfaceProps, TerminalCommand } from "@/types/core-components";

// We'll dynamically import xterm to avoid SSR issues
let Terminal: any;
let FitAddon: any;
let WebLinksAddon: any;

export function TerminalInterface({
  onCommand,
  initialCommands = ["Welcome to AI Teacher Terminal", "Type 'help' to see available commands"],
  height = "200px",
  className,
}: TerminalInterfaceProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<TerminalCommand[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);

  // Initialize terminal
  useEffect(() => {
    // Set mounted state first
    if (!mounted) {
      setMounted(true);
      return;
    }

    // Dynamically import xterm and its addons
    const loadTerminal = async () => {
      try {
        // Import the modules dynamically
        const xtermModule = await import('xterm');
        const fitAddonModule = await import('xterm-addon-fit');
        const webLinksAddonModule = await import('xterm-addon-web-links');

        // Import the CSS
        await import('xterm/css/xterm.css');

        // Assign to our variables
        Terminal = xtermModule.Terminal;
        FitAddon = fitAddonModule.FitAddon;
        WebLinksAddon = webLinksAddonModule.WebLinksAddon;

        if (!terminalRef.current) return;

        // Create terminal instance
        const term = new Terminal({
          cursorBlink: true,
          fontFamily: "var(--font-geist-mono)",
          fontSize: 14,
          theme: {
            background: "#1E1E1E",
            foreground: "#FFFFFF",
            cursor: "#FFFFFF",
            selection: "#5A5A5A",
          },
        });

        // Add addons
        const fitAddon = new FitAddon();
        const webLinksAddon = new WebLinksAddon();
        term.loadAddon(fitAddon);
        term.loadAddon(webLinksAddon);

        // Open terminal
        term.open(terminalRef.current);
        fitAddon.fit();

        // Store references
        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Write initial commands
        initialCommands.forEach((cmd) => {
          term.writeln(cmd);
        });
        term.write("\r\n$ ");

        // Handle terminal input
        let currentInput = "";
        term.onKey(({ key, domEvent }) => {
          const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

          if (domEvent.keyCode === 13) {
            // Enter key
            handleCommand(currentInput);
            currentInput = "";
            setHistoryIndex(-1);
          } else if (domEvent.keyCode === 8) {
            // Backspace
            if (currentInput.length > 0) {
              currentInput = currentInput.slice(0, -1);
              term.write("\b \b");
            }
          } else if (domEvent.keyCode === 38) {
            // Up arrow (history navigation)
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
              const newIndex = historyIndex + 1;
              setHistoryIndex(newIndex);
              const historyCommand = commandHistory[commandHistory.length - 1 - newIndex].command;

              // Clear current input
              while (currentInput.length > 0) {
                term.write("\b \b");
                currentInput = currentInput.slice(0, -1);
              }

              // Write history command
              term.write(historyCommand);
              currentInput = historyCommand;
            }
          } else if (domEvent.keyCode === 40) {
            // Down arrow (history navigation)
            if (historyIndex > 0) {
              const newIndex = historyIndex - 1;
              setHistoryIndex(newIndex);
              const historyCommand = commandHistory[commandHistory.length - 1 - newIndex].command;

              // Clear current input
              while (currentInput.length > 0) {
                term.write("\b \b");
                currentInput = currentInput.slice(0, -1);
              }

              // Write history command
              term.write(historyCommand);
              currentInput = historyCommand;
            } else if (historyIndex === 0) {
              // Clear input when reaching the end of history
              while (currentInput.length > 0) {
                term.write("\b \b");
                currentInput = currentInput.slice(0, -1);
              }
              setHistoryIndex(-1);
            }
          } else if (printable) {
            currentInput += key;
            term.write(key);
          }
        });

        // Handle window resize
        const handleResize = () => {
          if (fitAddonRef.current) {
            fitAddonRef.current.fit();
          }
        };

        window.addEventListener("resize", handleResize);

        // Return cleanup function
        return () => {
          if (term) {
            term.dispose();
          }
          window.removeEventListener("resize", handleResize);
        };
      } catch (error) {
        console.error("Failed to load terminal:", error);
      }
    };

    loadTerminal();
  }, [initialCommands, mounted, commandHistory, historyIndex]);

  // Handle command execution
  const handleCommand = (cmd: string) => {
    if (!xtermRef.current) return;

    const term = xtermRef.current;
    term.writeln("");

    if (cmd.trim()) {
      // Process command
      let output: string[] = [];

      if (cmd === "clear") {
        term.clear();
      } else if (cmd === "help") {
        output = [
          "Available commands:",
          "  help     - Show this help message",
          "  clear    - Clear the terminal",
          "  echo     - Echo a message",
          "  date     - Show current date and time",
        ];
      } else if (cmd.startsWith("echo ")) {
        output = [cmd.substring(5)];
      } else if (cmd === "date") {
        output = [new Date().toString()];
      } else {
        output = [`Command not found: ${cmd}`];
      }

      // Add to history
      setCommandHistory((prev) => [
        ...prev,
        { command: cmd, output, timestamp: new Date() },
      ]);

      // Write output
      output.forEach((line) => {
        term.writeln(line);
      });

      // Call onCommand callback if provided
      if (onCommand) {
        onCommand(cmd);
      }
    }

    term.write("$ ");
  };

  return (
    <div
      className={cn("border border-border rounded-md overflow-hidden", className)}
      style={{ height }}
    >
      <div ref={terminalRef} className="h-full w-full" />
    </div>
  );
}
