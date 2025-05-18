/**
 * Utility functions for the terminal interface component
 */

// Process a command and return the output
export const processCommand = (command: string): string[] => {
  const cmd = command.trim();
  
  if (!cmd) {
    return [];
  }

  if (cmd === "help") {
    return [
      "Available commands:",
      "  help     - Show this help message",
      "  clear    - Clear the terminal",
      "  echo     - Echo a message",
      "  date     - Show current date and time",
      "  ls       - List files in the current directory",
      "  cd       - Change directory",
      "  pwd      - Print working directory",
      "  cat      - Display file contents",
      "  run      - Run a script",
    ];
  }

  if (cmd === "clear") {
    return ["Terminal cleared"];
  }

  if (cmd.startsWith("echo ")) {
    return [cmd.substring(5)];
  }

  if (cmd === "date") {
    return [new Date().toString()];
  }

  if (cmd === "ls") {
    return [
      "index.js",
      "package.json",
      "README.md",
      "src/",
      "public/",
      "node_modules/",
    ];
  }

  if (cmd.startsWith("cd ")) {
    const dir = cmd.substring(3);
    return [`Changed directory to ${dir}`];
  }

  if (cmd === "pwd") {
    return ["/home/user/project"];
  }

  if (cmd.startsWith("cat ")) {
    const file = cmd.substring(4);
    if (file === "index.js") {
      return [
        "console.log('Hello, World!');",
        "",
        "function greet(name) {",
        "  return `Hello, ${name}!`;",
        "}",
        "",
        "greet('User');",
      ];
    }
    return [`File not found: ${file}`];
  }

  if (cmd.startsWith("run ")) {
    const script = cmd.substring(4);
    if (script === "index.js") {
      return [
        "Running index.js...",
        "Hello, World!",
        "Hello, User!",
        "Script executed successfully.",
      ];
    }
    return [`Script not found: ${script}`];
  }

  return [`Command not found: ${cmd}`];
};

// Terminal theme options
export const terminalThemes = {
  dark: {
    background: "#1E1E1E",
    foreground: "#FFFFFF",
    cursor: "#FFFFFF",
    selection: "#5A5A5A",
    black: "#000000",
    red: "#FF5555",
    green: "#50FA7B",
    yellow: "#F1FA8C",
    blue: "#BD93F9",
    magenta: "#FF79C6",
    cyan: "#8BE9FD",
    white: "#BFBFBF",
    brightBlack: "#4D4D4D",
    brightRed: "#FF6E6E",
    brightGreen: "#69FF94",
    brightYellow: "#FFFFA5",
    brightBlue: "#D6ACFF",
    brightMagenta: "#FF92DF",
    brightCyan: "#A4FFFF",
    brightWhite: "#E6E6E6",
  },
  light: {
    background: "#FFFFFF",
    foreground: "#000000",
    cursor: "#000000",
    selection: "#BFBFBF",
    black: "#000000",
    red: "#C51E14",
    green: "#1DC121",
    yellow: "#C7C329",
    blue: "#0A2FC4",
    magenta: "#C839C5",
    cyan: "#20C5C6",
    white: "#C7C7C7",
    brightBlack: "#686868",
    brightRed: "#FD6F6B",
    brightGreen: "#67F86F",
    brightYellow: "#FFFA72",
    brightBlue: "#6A76FB",
    brightMagenta: "#FD7CFC",
    brightCyan: "#68FDFE",
    brightWhite: "#FFFFFF",
  },
};

// Default terminal options
export const defaultTerminalOptions = {
  cursorBlink: true,
  fontFamily: "monospace",
  fontSize: 14,
  theme: terminalThemes.dark,
  scrollback: 1000,
  convertEol: true,
};
