import { NextResponse } from 'next/server';
import { mockTopicExplorerData } from '@/lib/mock-data';
import { TreeItem } from '@/types/core-components';

/**
 * GET /api/topics
 * Returns all topics
 */
export async function GET() {
  try {
    // In a real app, this would fetch from a database
    // For now, we'll use mock data
    return NextResponse.json(mockTopicExplorerData);
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/topics
 * Creates a new topic
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real app, this would save to a database
    // For now, we'll just return the created topic with a mock ID
    const newTopic: TreeItem = {
      id: `topic-${Date.now()}`,
      name: body.name,
      type: body.type,
      ...(body.language && { language: body.language }),
      ...(body.children && { children: body.children }),
    };
    
    return NextResponse.json(newTopic, { status: 201 });
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    );
  }
}
