import { TreeItem, Question, ProgressData, Achievement } from "@/types/core-components";

// Mock data for the topic explorer
export const mockTopicExplorerData: TreeItem[] = [
  {
    id: "algorithms",
    name: "Algorithms",
    type: "folder",
    children: [
      { id: "sorting", name: "Sorting Algorithms", type: "file", language: "code" },
      { id: "searching", name: "Searching Algorithms", type: "file", language: "code" },
      { id: "graph", name: "Graph Algorithms", type: "file", language: "code" },
      { 
        id: "dynamic-programming", 
        name: "Dynamic Programming", 
        type: "folder",
        children: [
          { id: "fibonacci", name: "Fibonacci Sequence", type: "file", language: "code" },
          { id: "knapsack", name: "Knapsack Problem", type: "file", language: "code" },
        ]
      },
    ],
  },
  {
    id: "data-structures",
    name: "Data Structures",
    type: "folder",
    children: [
      { id: "arrays", name: "Arrays", type: "file" },
      { id: "linked-lists", name: "Linked Lists", type: "file", language: "code" },
      { id: "trees", name: "Trees", type: "file", language: "code" },
      { id: "graphs", name: "Graphs", type: "file", language: "code" },
      { id: "hash-tables", name: "Hash Tables", type: "file", language: "code" },
    ],
  },
  {
    id: "programming",
    name: "Programming Concepts",
    type: "folder",
    children: [
      { id: "oop", name: "Object-Oriented Programming", type: "file" },
      { id: "functional", name: "Functional Programming", type: "file" },
      { id: "async", name: "Asynchronous Programming", type: "file", language: "code" },
      { id: "design-patterns", name: "Design Patterns", type: "file" },
    ],
  },
];

// Mock data for the code editor
export const mockCodeEditorValue = `// Binary Search implementation
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    }
    
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Target not found
}

// Example usage
const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17];
const targetValue = 7;
const result = binarySearch(sortedArray, targetValue);

console.log(\`Found \${targetValue} at index: \${result}\`);`;

// Mock data for the terminal interface
export const mockTerminalCommands = [
  "Welcome to AI Teacher Terminal",
  "Type 'help' to see available commands",
];

// Mock data for the output console
export const mockOutputConsoleData = [
  "Running binary_search.js...",
  "Found 7 at index: 3",
  "Execution completed successfully.",
];

// Mock data for the assessment interface
export const mockAssessmentQuestions: Question[] = [
  {
    id: "q1",
    type: "multiple-choice",
    prompt: "What is the time complexity of binary search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: "O(log n)",
    explanation: "Binary search has a time complexity of O(log n) because it divides the search interval in half with each comparison."
  },
  {
    id: "q2",
    type: "multiple-choice",
    prompt: "Which of the following data structures are used for implementing a priority queue? (Select all that apply)",
    options: ["Array", "Linked List", "Heap", "Hash Table"],
    correctAnswer: ["Array", "Heap"],
    explanation: "Priority queues can be implemented using arrays (for simple cases) or heaps (for efficient operations)."
  },
  {
    id: "q3",
    type: "text",
    prompt: "What sorting algorithm has the best average-case time complexity?",
    correctAnswer: "merge sort",
    explanation: "Merge sort has an average-case time complexity of O(n log n), which is optimal for comparison-based sorting algorithms."
  },
  {
    id: "q4",
    type: "coding",
    prompt: "Implement a function to check if a string is a palindrome.",
    code: "function isPalindrome(str) {\n  // Your code here\n}",
    language: "javascript",
    explanation: "A palindrome is a string that reads the same backward as forward."
  },
];

// Mock data for the progress dashboard
export const mockProgressData: ProgressData[] = generateMockProgressData();

function generateMockProgressData(): ProgressData[] {
  const data: ProgressData[] = [];
  const today = new Date();
  
  // Generate data for the last 180 days
  for (let i = 0; i < 180; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    
    // Generate random count (more recent dates have higher probability of activity)
    const probability = Math.min(1, 0.7 + (180 - i) / 180);
    const hasActivity = Math.random() < probability;
    
    if (hasActivity) {
      // Generate random count between 1 and 10
      const count = Math.floor(Math.random() * 10) + 1;
      data.push({ date: formattedDate, count });
    }
  }
  
  return data;
}

// Mock data for achievements
export const mockAchievements: Achievement[] = [
  {
    id: "a1",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "award",
    earned: true,
    earnedDate: "2023-05-15",
  },
  {
    id: "a2",
    title: "Code Ninja",
    description: "Complete 10 coding exercises",
    icon: "code",
    earned: true,
    earnedDate: "2023-06-02",
  },
  {
    id: "a3",
    title: "Perfect Score",
    description: "Get 100% on an assessment",
    icon: "check-circle",
    earned: true,
    earnedDate: "2023-06-10",
  },
  {
    id: "a4",
    title: "Algorithm Master",
    description: "Complete all algorithm lessons",
    icon: "cpu",
    earned: false,
  },
  {
    id: "a5",
    title: "30-Day Streak",
    description: "Learn for 30 consecutive days",
    icon: "calendar",
    earned: false,
  },
];
