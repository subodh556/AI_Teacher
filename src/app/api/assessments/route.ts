import { NextResponse } from 'next/server';
import { mockAssessmentQuestions } from '@/lib/mock-data';

/**
 * GET /api/assessments
 * Returns all assessments
 */
export async function GET() {
  try {
    // In a real app, this would fetch from a database
    // For now, we'll use mock data
    const assessments = [
      { id: 'assessment-1', title: 'JavaScript Basics', description: 'Test your knowledge of JavaScript fundamentals' },
      { id: 'assessment-2', title: 'React Fundamentals', description: 'Test your understanding of React core concepts' },
      { id: 'assessment-3', title: 'Data Structures', description: 'Test your knowledge of common data structures' },
    ];
    
    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/assessments
 * Submits an assessment
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.assessmentId || !body.answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real app, this would save to a database and calculate the score
    // For now, we'll simulate scoring
    const answerCount = Object.keys(body.answers).length;
    const score = Math.min(100, Math.round((answerCount / mockAssessmentQuestions.length) * 100));
    
    const result = {
      assessmentId: body.assessmentId,
      score,
      feedback: score > 80 
        ? 'Excellent work!' 
        : score > 60 
        ? 'Good job, but there\'s room for improvement.' 
        : 'You should review the material and try again.',
      completedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error submitting assessment:', error);
    return NextResponse.json(
      { error: 'Failed to submit assessment' },
      { status: 500 }
    );
  }
}
