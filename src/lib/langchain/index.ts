/**
 * LangChain Integration
 * 
 * This file serves as the main entry point for LangChain integration in the application.
 * It exports all the necessary functions and components for AI-powered features.
 */

import { initializeGeminiModel, generateWithGemini } from './gemini';
import { createStudyPlanChain, createExplanationChain, createQuizGenerationChain } from './chains';
import { retrieveRelevantDocuments, generateRAGResponse } from './rag';
import { cacheModelResponse, getCachedResponse, clearModelCache } from './cache';

// Export all LangChain-related functions and components
export {
  // Gemini API
  initializeGeminiModel,
  generateWithGemini,
  
  // LangChain chains
  createStudyPlanChain,
  createExplanationChain,
  createQuizGenerationChain,
  
  // RAG
  retrieveRelevantDocuments,
  generateRAGResponse,
  
  // Caching
  cacheModelResponse,
  getCachedResponse,
  clearModelCache
};

// Initialize the Gemini model when this module is imported
initializeGeminiModel();
