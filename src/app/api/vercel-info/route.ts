/**
 * Vercel Info API Endpoint
 * 
 * This serverless function provides information about the Vercel deployment environment.
 * It demonstrates how to use Vercel's serverless functions and environment variables.
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // Use Edge runtime for better performance

export async function GET(request: NextRequest) {
  // Get deployment information from Vercel environment variables
  const deploymentInfo = {
    environment: process.env.VERCEL_ENV || "development",
    region: process.env.VERCEL_REGION || "local",
    url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
    gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA || "none",
    gitCommitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || "none",
    gitCommitAuthorName: process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME || "none",
    gitRepo: process.env.VERCEL_GIT_REPO_SLUG || "none",
    gitBranch: process.env.VERCEL_GIT_COMMIT_REF || "none",
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(deploymentInfo, {
    status: 200,
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}
