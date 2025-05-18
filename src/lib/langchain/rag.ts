/**
 * Retrieval Augmented Generation (RAG)
 * 
 * This file contains the implementation of RAG for providing contextual explanations.
 */

import { generateWithGemini } from './gemini';
import { prisma } from '@/lib/prisma';

/**
 * Retrieves relevant documents based on a query
 * @param query - The user's query
 * @param userId - The user's ID
 * @param options - Additional options for retrieval
 * @returns An array of relevant documents
 */
export async function retrieveRelevantDocuments(
  query: string,
  userId: string,
  options?: {
    topicId?: string;
    contentId?: string;
    questionId?: string;
    limit?: number;
  }
): Promise<Array<{ id: string; content: string; title: string; source: string }>> {
  const limit = options?.limit || 5;
  const documents = [];

  try {
    // If contentId is provided, retrieve that specific content
    if (options?.contentId) {
      const content = await prisma.content.findUnique({
        where: { id: options.contentId },
        include: {
          topic: true
        }
      });

      if (content) {
        documents.push({
          id: content.id,
          content: JSON.stringify(content.content_data),
          title: content.title,
          source: `Topic: ${content.topic.name}`
        });
      }
    }
    
    // If questionId is provided, retrieve that specific question
    else if (options?.questionId) {
      const question = await prisma.question.findUnique({
        where: { id: options.questionId },
        include: {
          assessment: {
            include: {
              topic: true
            }
          }
        }
      });

      if (question) {
        documents.push({
          id: question.id,
          content: `${question.question_text}\n${question.explanation}`,
          title: `Question: ${question.question_text.substring(0, 50)}...`,
          source: `Assessment: ${question.assessment.title}, Topic: ${question.assessment.topic.name}`
        });
      }
    }
    
    // If topicId is provided, retrieve content for that topic
    else if (options?.topicId) {
      const contents = await prisma.content.findMany({
        where: { topic_id: options.topicId },
        include: {
          topic: true
        },
        take: limit
      });

      documents.push(...contents.map(content => ({
        id: content.id,
        content: JSON.stringify(content.content_data),
        title: content.title,
        source: `Topic: ${content.topic.name}`
      })));
    }
    
    // Otherwise, perform a search across all content
    else {
      // Get user's progress to understand their knowledge level
      const userProgress = await prisma.userProgress.findMany({
        where: { user_id: userId },
        include: {
          topic: true
        }
      });
      
      // Find topics related to the query
      // This is a simple implementation - in a real system, you would use
      // vector embeddings and semantic search
      const topics = await prisma.topic.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        }
      });
      
      // Get content for the related topics
      if (topics.length > 0) {
        const topicIds = topics.map(topic => topic.id);
        const contents = await prisma.content.findMany({
          where: { topic_id: { in: topicIds } },
          include: {
            topic: true
          },
          take: limit
        });
        
        documents.push(...contents.map(content => ({
          id: content.id,
          content: JSON.stringify(content.content_data),
          title: content.title,
          source: `Topic: ${content.topic.name}`
        })));
      }
      
      // If we still don't have enough documents, get the most recent content the user interacted with
      if (documents.length < limit) {
        const recentProgress = userProgress
          .sort((a, b) => new Date(b.last_interaction || 0).getTime() - new Date(a.last_interaction || 0).getTime())
          .slice(0, limit - documents.length);
        
        const recentTopicIds = recentProgress.map(progress => progress.topic_id);
        
        const recentContents = await prisma.content.findMany({
          where: { 
            topic_id: { in: recentTopicIds },
            id: { notIn: documents.map(doc => doc.id) } // Avoid duplicates
          },
          include: {
            topic: true
          },
          take: limit - documents.length
        });
        
        documents.push(...recentContents.map(content => ({
          id: content.id,
          content: JSON.stringify(content.content_data),
          title: content.title,
          source: `Topic: ${content.topic.name}`
        })));
      }
    }

    return documents;
  } catch (error) {
    console.error('Error retrieving documents:', error);
    return [];
  }
}

/**
 * Generates a response using RAG
 * @param query - The user's query
 * @param documents - The retrieved documents
 * @param userId - The user's ID
 * @returns The generated response
 */
export async function generateRAGResponse(
  query: string,
  documents: Array<{ id: string; content: string; title: string; source: string }>,
  userId: string
): Promise<{
  response: string;
  sources: Array<{ id: string; title: string; source: string }>;
}> {
  try {
    // Get user's knowledge level
    const userProgress = await prisma.userProgress.findMany({
      where: { user_id: userId }
    });
    
    // Calculate average proficiency level
    const avgProficiency = userProgress.length > 0
      ? userProgress.reduce((sum, progress) => sum + progress.proficiency_level, 0) / userProgress.length
      : 50; // Default to intermediate level
    
    // Determine knowledge level
    let knowledgeLevel = 'intermediate';
    if (avgProficiency < 30) knowledgeLevel = 'beginner';
    else if (avgProficiency > 70) knowledgeLevel = 'advanced';
    
    // Combine document content into context
    const context = documents.map(doc => 
      `Title: ${doc.title}\nSource: ${doc.source}\nContent: ${doc.content}`
    ).join('\n\n');
    
    // Generate response using Gemini
    const prompt = `
      User query: ${query}
      
      Knowledge level: ${knowledgeLevel}
      
      Context information:
      ${context}
      
      Based on the above context and the user's knowledge level (${knowledgeLevel}), provide a helpful, accurate response to their query.
      Focus on being educational and clear. If the context doesn't contain enough information to answer the query confidently, acknowledge this limitation.
    `;
    
    const response = await generateWithGemini(prompt, {
      temperature: 0.3,
      systemPrompt: "You are an expert educational AI assistant that provides clear, accurate explanations tailored to the user's knowledge level. Use the provided context to answer questions, but don't reference the context directly in your response."
    });
    
    return {
      response,
      sources: documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        source: doc.source
      }))
    };
  } catch (error) {
    console.error('Error generating RAG response:', error);
    return {
      response: 'I apologize, but I encountered an issue generating a response. Please try again later.',
      sources: []
    };
  }
}
