/**
 * GraphQL API Endpoint
 * 
 * This file sets up the GraphQL endpoint for complex data queries.
 */

import { createYoga } from 'graphql-yoga';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';

// Create a Yoga instance with schema and resolvers
const { handleRequest } = createYoga({
  schema: {
    typeDefs,
    resolvers
  },
  // Disable GraphiQL in production
  graphiql: process.env.NODE_ENV !== 'production',
  // Configure CORS
  cors: {
    origin: '*',
    credentials: true,
    methods: ['POST', 'GET', 'OPTIONS']
  },
  // Add custom context
  context: async ({ request }) => {
    // You can add authentication and other context here
    return {
      request
    };
  }
});

// Export GET and POST handlers for the API route
export const GET = handleRequest;
export const POST = handleRequest;
