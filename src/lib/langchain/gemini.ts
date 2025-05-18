/**
 * Gemini API Integration
 * 
 * This file contains the configuration and utility functions for the Gemini API.
 */

import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai';

// Environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const DEFAULT_MODEL = 'gemini-pro';

// Global model instance
let geminiModel: GenerativeModel | null = null;

/**
 * Initializes the Gemini model with the specified configuration
 * @param modelName - The name of the Gemini model to use (default: 'gemini-pro')
 * @returns The initialized Gemini model
 */
export function initializeGeminiModel(modelName: string = DEFAULT_MODEL): GenerativeModel {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  if (geminiModel) {
    return geminiModel;
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Default generation config
    const generationConfig: GenerationConfig = {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
    };
    
    geminiModel = genAI.getGenerativeModel({ model: modelName, generationConfig });
    
    return geminiModel;
  } catch (error) {
    console.error('Error initializing Gemini model:', error);
    throw new Error('Failed to initialize Gemini model');
  }
}

/**
 * Generates text using the Gemini model
 * @param prompt - The prompt to send to the model
 * @param options - Optional generation options
 * @returns The generated text
 */
export async function generateWithGemini(
  prompt: string,
  options?: {
    temperature?: number;
    maxOutputTokens?: number;
    systemPrompt?: string;
  }
): Promise<string> {
  try {
    if (!geminiModel) {
      geminiModel = initializeGeminiModel();
    }
    
    // Create chat session with system prompt if provided
    if (options?.systemPrompt) {
      const chat = geminiModel.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: options.systemPrompt }],
          },
          {
            role: 'model',
            parts: [{ text: 'I understand and will follow these instructions.' }],
          },
        ],
        generationConfig: {
          temperature: options?.temperature,
          maxOutputTokens: options?.maxOutputTokens,
        },
      });
      
      const result = await chat.sendMessage(prompt);
      return result.response.text();
    }
    
    // Simple completion without chat
    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating with Gemini:', error);
    
    // Provide a fallback response
    return 'I apologize, but I encountered an issue generating a response. Please try again later.';
  }
}
