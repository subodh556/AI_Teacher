/**
 * Utility functions for the code editor component
 */

// Default editor options
export const defaultEditorOptions = {
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  fontSize: 14,
  lineNumbers: "on",
  readOnly: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: "on",
};

// Available languages for the editor
export const availableLanguages = [
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "html", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "json", name: "JSON" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "csharp", name: "C#" },
  { id: "cpp", name: "C++" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "ruby", name: "Ruby" },
  { id: "php", name: "PHP" },
  { id: "sql", name: "SQL" },
  { id: "markdown", name: "Markdown" },
];

// Get language name from ID
export const getLanguageName = (languageId: string): string => {
  const language = availableLanguages.find((lang) => lang.id === languageId);
  return language ? language.name : languageId;
};

// Format code based on language
export const formatCode = (code: string, language: string): string => {
  // This is a placeholder for actual formatting logic
  // In a real implementation, you would use a library like prettier
  return code;
};

// Get file extension from language
export const getFileExtension = (language: string): string => {
  switch (language) {
    case "javascript":
      return ".js";
    case "typescript":
      return ".ts";
    case "html":
      return ".html";
    case "css":
      return ".css";
    case "json":
      return ".json";
    case "python":
      return ".py";
    case "java":
      return ".java";
    case "csharp":
      return ".cs";
    case "cpp":
      return ".cpp";
    case "go":
      return ".go";
    case "rust":
      return ".rs";
    case "ruby":
      return ".rb";
    case "php":
      return ".php";
    case "sql":
      return ".sql";
    case "markdown":
      return ".md";
    default:
      return ".txt";
  }
};

// Get starter code for a language
export const getStarterCode = (language: string): string => {
  switch (language) {
    case "javascript":
      return `// JavaScript starter code
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
`;
    case "typescript":
      return `// TypeScript starter code
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
`;
    case "python":
      return `# Python starter code
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
`;
    case "java":
      return `// Java starter code
public class Main {
    public static void main(String[] args) {
        System.out.println(greet("World"));
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}
`;
    default:
      return `// ${getLanguageName(language)} starter code
// Start coding here...
`;
  }
};
