/**
 * LangChain Chains
 * 
 * This file contains the LangChain chains for different AI tasks.
 */

import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { generateWithGemini } from './gemini';

/**
 * Creates a chain for generating personalized study plans
 * @returns A runnable sequence for generating study plans
 */
export function createStudyPlanChain() {
  // Define the prompt template for study plan generation
  const studyPlanPromptTemplate = PromptTemplate.fromTemplate(`
    You are an AI educational assistant tasked with creating a personalized study plan.
    
    User Information:
    - User ID: {userId}
    - Current proficiency levels: {proficiencyLevels}
    - Learning preferences: {preferences}
    - Available time: {availableTime} hours per week
    
    Topics to cover:
    {topics}
    
    Previous assessment results:
    {assessmentResults}
    
    Create a detailed, personalized study plan that:
    1. Prioritizes topics based on proficiency gaps and importance
    2. Allocates appropriate time for each topic
    3. Recommends specific learning resources
    4. Includes practice exercises and assessments
    5. Adapts to the user's learning preferences
    6. Can be completed within the available time
    
    Format the study plan as a JSON object with the following structure:
    {
      "userId": "string",
      "createdAt": "ISO date string",
      "weeklyPlan": [
        {
          "day": "string (e.g., 'Monday')",
          "topics": [
            {
              "topicId": "string",
              "name": "string",
              "durationMinutes": number,
              "resources": [
                {
                  "type": "string (e.g., 'video', 'article', 'exercise')",
                  "title": "string",
                  "description": "string"
                }
              ]
            }
          ]
        }
      ],
      "estimatedCompletionWeeks": number,
      "recommendations": [
        "string"
      ]
    }
  `);

  // Create a runnable sequence
  return RunnableSequence.from([
    studyPlanPromptTemplate,
    async (prompt: string) => {
      return await generateWithGemini(prompt, {
        temperature: 0.2, // Lower temperature for more consistent output
        systemPrompt: "You are an expert educational AI assistant that creates personalized study plans based on user data. Always format your response as valid JSON."
      });
    },
    new StringOutputParser(),
  ]);
}

/**
 * Creates a chain for generating contextual explanations
 * @returns A runnable sequence for generating explanations
 */
export function createExplanationChain() {
  // Define the prompt template for explanations
  const explanationPromptTemplate = PromptTemplate.fromTemplate(`
    You are an AI educational assistant tasked with providing a clear explanation.
    
    User query: {query}
    
    Context information:
    {context}
    
    User's current knowledge level: {knowledgeLevel}
    
    Provide a clear, concise explanation that:
    1. Directly addresses the user's query
    2. Uses language appropriate for their knowledge level
    3. Builds on concepts they already understand
    4. Includes relevant examples where appropriate
    5. Avoids unnecessary jargon
    6. Connects the explanation to practical applications
    
    Your explanation should be helpful, accurate, and tailored to the user's current understanding.
  `);

  // Create a runnable sequence
  return RunnableSequence.from([
    explanationPromptTemplate,
    async (prompt: string) => {
      return await generateWithGemini(prompt, {
        temperature: 0.3,
        systemPrompt: "You are an expert educational AI assistant that provides clear, accurate explanations tailored to the user's knowledge level."
      });
    },
    new StringOutputParser(),
  ]);
}

/**
 * Creates a chain for generating quiz questions
 * @returns A runnable sequence for generating quiz questions
 */
export function createQuizGenerationChain() {
  // Define the prompt template for quiz generation
  const quizGenerationPromptTemplate = PromptTemplate.fromTemplate(`
    You are an AI educational assistant tasked with creating quiz questions.
    
    Topic: {topic}
    Subtopics: {subtopics}
    Difficulty level: {difficultyLevel} (1-5, where 5 is most difficult)
    Question types to include: {questionTypes}
    Number of questions to generate: {numberOfQuestions}
    
    User's knowledge gaps: {knowledgeGaps}
    
    Generate quiz questions that:
    1. Target the specified topic and subtopics
    2. Match the requested difficulty level
    3. Focus on the user's knowledge gaps
    4. Include a mix of the requested question types
    5. Have clear, unambiguous correct answers
    6. Include helpful explanations for each answer
    
    Format the questions as a JSON array with the following structure:
    [
      {
        "id": "unique string",
        "questionText": "string",
        "questionType": "string (e.g., 'multiple-choice', 'short-answer', 'coding')",
        "difficultyLevel": number (1-5),
        "options": [
          {
            "id": "string",
            "text": "string"
          }
        ],
        "correctAnswer": "string (option id for multiple-choice, text for other types)",
        "explanation": "string explaining why this is the correct answer"
      }
    ]
  `);

  // Create a runnable sequence
  return RunnableSequence.from([
    quizGenerationPromptTemplate,
    async (prompt: string) => {
      return await generateWithGemini(prompt, {
        temperature: 0.4,
        systemPrompt: "You are an expert educational AI assistant that creates high-quality quiz questions. Always format your response as valid JSON."
      });
    },
    new StringOutputParser(),
  ]);
}
