/**
 * AI Explanations API Endpoints
 *
 * This file contains the API endpoints for AI-powered explanations.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  handleApiError,
  validateRequest,
  parseRequestBody
} from '@/lib/api-utils';
import { aiExplanationSchema } from '@/lib/validation';

/**
 * POST /api/ai/explanations
 * Generates AI-powered explanations for content or questions
 */
export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const validatedData = await validateRequest(body, aiExplanationSchema);

    const { user_id, content_id, question_id, query } = validatedData;

    // Find or create the user in the database
    let user = await prisma.user.findFirst({
      where: { email: user_id }
    });

    // If user doesn't exist, create a new user
    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            email: user_id,
            name: 'New User', // Default name
          }
        });
        console.log('Created new user:', user.id);
      } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }
    }

    // Get context for the explanation
    let context = '';
    let title = '';

    if (content_id) {
      // Get content data
      const content = await prisma.content.findUnique({
        where: { id: content_id },
        include: {
          topic: true
        }
      });

      if (!content) {
        return NextResponse.json(
          { error: 'Content not found' },
          { status: 404 }
        );
      }

      title = content.title;

      // Extract text from content data
      const contentData = content.content_data as any;
      if (contentData.text) {
        context = contentData.text;
      } else if (contentData.sections) {
        context = contentData.sections.map((s: any) => s.text).join('\n\n');
      }

      // Add topic information
      context += `\n\nThis content is part of the topic: ${content.topic.name}. ${content.topic.description}`;
    } else if (question_id) {
      // Get question data
      const question = await prisma.question.findUnique({
        where: { id: question_id },
        include: {
          assessment: {
            include: {
              topic: true
            }
          }
        }
      });

      if (!question) {
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404 }
        );
      }

      title = `Question: ${question.question_text}`;
      context = `Question: ${question.question_text}\n\n`;

      if (question.options) {
        const options = question.options as any[];
        context += 'Options:\n';
        options.forEach((option: any) => {
          context += `- ${option.text}\n`;
        });
      }

      context += `\nCorrect answer: ${question.correct_answer}\n\n`;
      context += `Explanation: ${question.explanation}\n\n`;
      context += `This question is part of the assessment: ${question.assessment.title}.\n`;
      context += `Topic: ${question.assessment.topic.name}. ${question.assessment.topic.description}`;
    }

    // In a real implementation, this would call an AI service like OpenAI
    // For now, we'll simulate a response

    // Get topic ID if available
    const topicId = content_id
      ? (await prisma.content.findUnique({ where: { id: content_id }, select: { topic_id: true } }))?.topic_id
      : question_id
        ? (await prisma.question.findUnique({
            where: { id: question_id },
            include: { assessment: { select: { topic_id: true } } }
          }))?.assessment.topic_id
        : undefined;

    // Track user interaction if topic ID is available
    if (topicId) {
      // Check if user progress exists
      const existingProgress = await prisma.userProgress.findFirst({
        where: {
          user_id: user.id,
          topic_id: topicId
        }
      });

      if (existingProgress) {
        // Update existing progress
        await prisma.userProgress.updateMany({
          where: {
            user_id: user.id,
            topic_id: topicId
          },
          data: {
            last_interaction: new Date()
          }
        });
      } else {
        // Create new progress
        await prisma.userProgress.create({
          data: {
            user_id: user.id,
            topic_id: topicId,
            proficiency_level: 50, // Default starting level
            last_interaction: new Date()
          }
        });
      }
    }

    // Generate explanation (simulated)
    const explanation = generateSimulatedExplanation(query, context);

    return NextResponse.json({
      query,
      title,
      explanation,
      sources: [
        {
          title: title,
          content: context.substring(0, 100) + '...'
        }
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return handleApiError(error, 'Failed to generate explanation');
  }
}

/**
 * Generates a simulated explanation based on the query and context
 * In a real implementation, this would be replaced with an AI service call
 */
function generateSimulatedExplanation(query: string, context: string): string {
  // This is a placeholder for an actual AI-generated explanation
  // In a real implementation, this would call an AI service like OpenAI

  const queryLower = query.toLowerCase();

  if (queryLower.includes('explain') || queryLower.includes('what is')) {
    return `Here's an explanation based on your query "${query}":\n\n` +
      `The concept you're asking about is fundamental to understanding this topic. ` +
      `It involves several key principles that build upon each other. ` +
      `First, you need to understand the basic terminology and how it relates to the broader context. ` +
      `Then, you can explore the practical applications and see how these concepts are used in real-world scenarios.\n\n` +
      `Does this help clarify your question? If you need more specific details, please ask a more targeted question.`;
  }

  if (queryLower.includes('example') || queryLower.includes('show me')) {
    return `Here's an example related to your query "${query}":\n\n` +
      `Let's walk through a practical example step by step:\n\n` +
      `1. First, we identify the problem we're trying to solve\n` +
      `2. Then, we break it down into smaller, manageable parts\n` +
      `3. Next, we apply the relevant concepts to each part\n` +
      `4. Finally, we combine the solutions to solve the original problem\n\n` +
      `This approach demonstrates how to apply theoretical knowledge in a practical context.`;
  }

  if (queryLower.includes('difference') || queryLower.includes('compare')) {
    return `Regarding your query "${query}", here's a comparison:\n\n` +
      `There are several key differences to consider:\n\n` +
      `1. Conceptual foundation: The first concept is based on X principles, while the second is derived from Y theory\n` +
      `2. Application context: They are typically used in different scenarios\n` +
      `3. Implementation complexity: One is generally simpler to apply than the other\n` +
      `4. Performance characteristics: They have different strengths and weaknesses in various situations\n\n` +
      `Understanding these differences will help you choose the right approach for your specific needs.`;
  }

  // Default response
  return `In response to your query "${query}":\n\n` +
    `This is an important question that touches on core concepts in this subject area. ` +
    `The answer involves understanding several interconnected ideas and how they relate to each other. ` +
    `The context you're asking about has both theoretical and practical aspects that are worth exploring. ` +
    `I'd recommend focusing on the fundamental principles first, then looking at how they're applied in different situations.\n\n` +
    `If you'd like to explore a specific aspect of this topic in more detail, please let me know.`;
}
