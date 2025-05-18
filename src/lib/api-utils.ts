/**
 * API Utility Functions
 * 
 * This file contains utility functions for API endpoints.
 */

import { NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';

/**
 * Handles API errors and returns an appropriate response
 * @param error - The error object
 * @param message - Optional custom error message
 * @returns NextResponse with error details
 */
export function handleApiError(error: unknown, message?: string): NextResponse {
  console.error('API Error:', error);
  
  // Handle validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      { 
        error: 'Validation error', 
        details: error.errors 
      },
      { status: 400 }
    );
  }
  
  // Handle other known error types
  if (error instanceof Error) {
    return NextResponse.json(
      { error: message || error.message },
      { status: 500 }
    );
  }
  
  // Handle unknown errors
  return NextResponse.json(
    { error: message || 'An unexpected error occurred' },
    { status: 500 }
  );
}

/**
 * Validates request data against a schema
 * @param data - The data to validate
 * @param schema - The Zod schema to validate against
 * @returns Validated data or throws ZodError
 */
export async function validateRequest<T>(data: unknown, schema: ZodSchema<T>): Promise<T> {
  return schema.parseAsync(data);
}

/**
 * Extracts and validates query parameters from a request URL
 * @param request - The request object
 * @param requiredParams - Array of required parameter names
 * @returns Object with extracted parameters or throws error
 */
export function extractQueryParams(
  request: Request,
  requiredParams: string[] = []
): Record<string, string | null> {
  const { searchParams } = new URL(request.url);
  const params: Record<string, string | null> = {};
  
  // Extract all parameters
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  // Check for required parameters
  for (const param of requiredParams) {
    if (!params[param]) {
      throw new Error(`Missing required query parameter: ${param}`);
    }
  }
  
  return params;
}

/**
 * Creates a success response with the provided data
 * @param data - The data to include in the response
 * @param status - Optional HTTP status code (default: 200)
 * @returns NextResponse with the data
 */
export function createSuccessResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}

/**
 * Creates an error response with the provided message
 * @param message - The error message
 * @param status - Optional HTTP status code (default: 400)
 * @returns NextResponse with the error message
 */
export function createErrorResponse(message: string, status: number = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Parses the request body as JSON
 * @param request - The request object
 * @returns Parsed JSON body or throws error
 */
export async function parseRequestBody<T = any>(request: Request): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}

/**
 * Extracts user ID from the request
 * This is a placeholder that should be updated with your actual auth implementation
 * @param request - The request object
 * @returns User ID or null if not authenticated
 */
export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  // This is a placeholder - replace with your actual auth implementation
  // For example, you might extract a token from headers and verify it
  
  // For now, we'll check if userId is in the query params
  const { searchParams } = new URL(request.url);
  return searchParams.get('userId');
}
