/**
 * Code Execution Utilities
 * 
 * This file contains utility functions for executing code using the Piston API.
 * Piston is a secure code execution engine that supports multiple programming languages.
 */

// Types for Piston API
export interface PistonRuntime {
  language: string;
  version: string;
  aliases: string[];
}

export interface PistonExecuteRequest {
  language: string;
  version: string;
  files: {
    name?: string;
    content: string;
    encoding?: 'base64' | 'hex' | 'utf8';
  }[];
  stdin?: string;
  args?: string[];
  compile_timeout?: number;
  run_timeout?: number;
  compile_memory_limit?: number;
  run_memory_limit?: number;
}

export interface PistonExecuteResponse {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
    message: string | null;
    status: string | null;
    cpu_time: number;
    wall_time: number;
    memory: number;
  };
  compile?: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
    message: string | null;
    status: string | null;
    cpu_time: number;
    wall_time: number;
    memory: number;
  };
}

// Cache for supported languages
let supportedLanguagesCache: PistonRuntime[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

/**
 * Fetches the list of supported languages from the Piston API
 * @returns Array of supported languages
 */
export async function fetchSupportedLanguages(): Promise<PistonRuntime[]> {
  const now = Date.now();
  
  // Return cached languages if available and not expired
  if (supportedLanguagesCache && now - lastFetchTime < CACHE_DURATION) {
    return supportedLanguagesCache;
  }
  
  try {
    const response = await fetch('https://emkc.org/api/v2/piston/runtimes');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch supported languages: ${response.statusText}`);
    }
    
    const data = await response.json() as PistonRuntime[];
    supportedLanguagesCache = data;
    lastFetchTime = now;
    
    return data;
  } catch (error) {
    console.error('Error fetching supported languages:', error);
    
    // Return cached data if available, even if expired
    if (supportedLanguagesCache) {
      return supportedLanguagesCache;
    }
    
    throw error;
  }
}

/**
 * Executes code using the Piston API
 * @param language Programming language
 * @param code Source code to execute
 * @param input Standard input for the program
 * @param args Command line arguments
 * @returns Execution result
 */
export async function executeCode(
  language: string,
  code: string,
  input: string = '',
  args: string[] = []
): Promise<PistonExecuteResponse> {
  try {
    // Get the latest version of the language
    const languages = await fetchSupportedLanguages();
    const languageRuntime = languages.find(
      l => l.language === language || l.aliases.includes(language)
    );
    
    if (!languageRuntime) {
      throw new Error(`Language '${language}' is not supported`);
    }
    
    const requestBody: PistonExecuteRequest = {
      language: languageRuntime.language,
      version: languageRuntime.version,
      files: [
        {
          content: code
        }
      ],
      stdin: input,
      args: args,
      compile_timeout: 10000, // 10 seconds
      run_timeout: 5000, // 5 seconds
    };
    
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to execute code: ${response.statusText} - ${errorText}`);
    }
    
    return await response.json() as PistonExecuteResponse;
  } catch (error) {
    console.error('Error executing code:', error);
    throw error;
  }
}

/**
 * Gets a list of common programming languages with their Piston identifiers
 * @returns Array of language objects with id, name, and version
 */
export function getCommonLanguages() {
  return [
    { id: 'python', name: 'Python', version: '3.x' },
    { id: 'javascript', name: 'JavaScript', version: 'Node.js' },
    { id: 'typescript', name: 'TypeScript', version: 'Node.js' },
    { id: 'java', name: 'Java', version: 'OpenJDK' },
    { id: 'c', name: 'C', version: 'GCC' },
    { id: 'cpp', name: 'C++', version: 'GCC' },
    { id: 'csharp', name: 'C#', version: 'Mono' },
    { id: 'go', name: 'Go', version: 'Go' },
    { id: 'ruby', name: 'Ruby', version: 'Ruby' },
    { id: 'rust', name: 'Rust', version: 'Rust' },
    { id: 'php', name: 'PHP', version: 'PHP' },
    { id: 'swift', name: 'Swift', version: 'Swift' },
  ];
}
