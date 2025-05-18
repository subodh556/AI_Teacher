/**
 * Prisma Client Singleton
 * 
 * This file creates a singleton instance of the Prisma Client to prevent
 * multiple instances during development hot reloading.
 */

import { PrismaClient } from '@/generated/prisma';

// Define a global type for the Prisma client
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton instance of the Prisma client
export const prisma = global.prisma || new PrismaClient();

// In development, attach the client to the global object to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
