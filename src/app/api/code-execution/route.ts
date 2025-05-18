/**
 * Code Execution API Endpoint
 *
 * This API endpoint proxies requests to the Piston API for code execution.
 * It adds authentication, rate limiting, and error handling.
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeCode, PistonExecuteResponse } from '@/lib/code-execution';
import { currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';

// Validation schema for code execution request
const ExecuteRequestSchema = z.object({
  language: z.string().min(1, "Language is required"),
  code: z.string().min(1, "Code is required"),
  input: z.string().optional().default(""),
  args: z.array(z.string()).optional().default([]),
});

// Rate limiting map
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

/**
 * POST handler for code execution
 */
export async function POST(request: NextRequest) {
  try {
    // Get user ID for rate limiting
    const user = await currentUser();
    const userId = user?.id;
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = userId || clientIp;

    // Apply rate limiting
    const now = Date.now();
    const userRateLimit = rateLimitMap.get(rateLimitKey);

    if (userRateLimit) {
      // Reset count if window has passed
      if (now - userRateLimit.timestamp > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(rateLimitKey, { count: 1, timestamp: now });
      }
      // Increment count if within window
      else if (userRateLimit.count < RATE_LIMIT) {
        rateLimitMap.set(rateLimitKey, {
          count: userRateLimit.count + 1,
          timestamp: userRateLimit.timestamp
        });
      }
      // Return rate limit error
      else {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    } else {
      // First request from this user
      rateLimitMap.set(rateLimitKey, { count: 1, timestamp: now });
    }

    // Parse and validate request body
    const body = await request.json();
    const result = ExecuteRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }

    const { language, code, input, args } = result.data;

    // Execute the code
    const executionResult = await executeCode(language, code, input, args);

    // Return the execution result
    return NextResponse.json(executionResult);
  } catch (error) {
    console.error('Error in code execution API:', error);

    // Return appropriate error response
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * GET handler for checking API status
 */
export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
