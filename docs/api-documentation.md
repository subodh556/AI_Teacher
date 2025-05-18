# API Documentation

This document provides documentation for the API endpoints available in the AI Teacher application.

## Table of Contents

1. [Authentication](#authentication)
2. [RESTful API Endpoints](#restful-api-endpoints)
   - [Assessment API](#assessment-api)
   - [Learning API](#learning-api)
   - [Progress API](#progress-api)
   - [Achievements API](#achievements-api)
   - [AI API](#ai-api)
3. [GraphQL API](#graphql-api)
   - [Queries](#queries)
   - [Mutations](#mutations)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)

## Authentication

All API endpoints require authentication. The application uses Clerk for authentication, and API requests should include the appropriate authentication headers.

## RESTful API Endpoints

### Assessment API

#### GET /api/assessment

Returns all assessments or filtered by topic.

**Query Parameters:**
- `topic_id` (optional): Filter assessments by topic ID

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Assessment Title",
    "description": "Assessment Description",
    "topic_id": "uuid",
    "adaptive": false,
    "topic": {
      "name": "Topic Name",
      "difficulty_level": 3
    },
    "_count": {
      "questions": 10
    }
  }
]
```

#### POST /api/assessment

Creates a new assessment.

**Request Body:**
```json
{
  "title": "Assessment Title",
  "description": "Assessment Description",
  "topic_id": "uuid",
  "adaptive": false
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Assessment Title",
  "description": "Assessment Description",
  "topic_id": "uuid",
  "adaptive": false
}
```

#### PUT /api/assessment

Updates an existing assessment.

**Request Body:**
```json
{
  "id": "uuid",
  "title": "Updated Title",
  "description": "Updated Description",
  "adaptive": true
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Updated Title",
  "description": "Updated Description",
  "topic_id": "uuid",
  "adaptive": true
}
```

#### DELETE /api/assessment

Deletes an assessment.

**Query Parameters:**
- `id` (required): Assessment ID to delete

**Response:**
```json
{
  "message": "Assessment deleted successfully"
}
```

#### GET /api/assessment/[id]

Returns a specific assessment with its questions.

**Response:**
```json
{
  "id": "uuid",
  "title": "Assessment Title",
  "description": "Assessment Description",
  "topic_id": "uuid",
  "adaptive": false,
  "topic": {
    "name": "Topic Name",
    "description": "Topic Description",
    "difficulty_level": 3
  },
  "questions": [
    {
      "id": "uuid",
      "assessment_id": "uuid",
      "question_text": "Question Text",
      "question_type": "multiple-choice",
      "options": [...],
      "correct_answer": "Answer",
      "difficulty_level": 2,
      "explanation": "Explanation"
    }
  ]
}
```

#### POST /api/assessment/[id]/submit

Submits an assessment attempt.

**Request Body:**
```json
{
  "userId": "uuid",
  "answers": {
    "question-id-1": "answer1",
    "question-id-2": "answer2"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "score": 85,
  "feedback": "Good job, but there's room for improvement.",
  "completedAt": "2023-06-15T10:30:00Z"
}
```

#### GET /api/assessment/questions

Returns questions for a specific assessment.

**Query Parameters:**
- `assessment_id` (required): Assessment ID

**Response:**
```json
[
  {
    "id": "uuid",
    "assessment_id": "uuid",
    "question_text": "Question Text",
    "question_type": "multiple-choice",
    "options": [...],
    "correct_answer": "Answer",
    "difficulty_level": 2,
    "explanation": "Explanation"
  }
]
```

### Learning API

#### GET /api/learning

Returns all learning content or filtered by topic.

**Query Parameters:**
- `topic_id` (optional): Filter content by topic ID

**Response:**
```json
[
  {
    "id": "uuid",
    "topic_id": "uuid",
    "title": "Content Title",
    "content_type": "text",
    "content_data": {...},
    "difficulty_level": 2,
    "topic": {
      "name": "Topic Name",
      "difficulty_level": 3
    }
  }
]
```

#### POST /api/learning

Creates new learning content.

**Request Body:**
```json
{
  "topic_id": "uuid",
  "title": "Content Title",
  "content_type": "text",
  "content_data": {...},
  "difficulty_level": 2
}
```

**Response:**
```json
{
  "id": "uuid",
  "topic_id": "uuid",
  "title": "Content Title",
  "content_type": "text",
  "content_data": {...},
  "difficulty_level": 2
}
```

#### GET /api/learning/content/[id]

Returns a specific content item.

**Response:**
```json
{
  "id": "uuid",
  "topic_id": "uuid",
  "title": "Content Title",
  "content_type": "text",
  "content_data": {...},
  "difficulty_level": 2,
  "topic": {
    "name": "Topic Name",
    "description": "Topic Description",
    "difficulty_level": 3
  }
}
```

#### POST /api/learning/content/[id]/track

Tracks user interaction with content.

**Request Body:**
```json
{
  "userId": "uuid",
  "completed": true
}
```

**Response:**
```json
{
  "message": "Progress tracked successfully",
  "progress": {...}
}
```

#### GET /api/learning/study-plans

Returns study plans for a specific user.

**Query Parameters:**
- `user_id` (required): User ID

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "created_at": "2023-06-15T10:30:00Z",
    "updated_at": "2023-06-15T10:30:00Z",
    "plan_data": {...},
    "ai_generated": true
  }
]
```

### Progress API

#### GET /api/progress

Returns user progress.

**Query Parameters:**
- `user_id` (required): User ID

**Response:**
```json
{
  "progress": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "topic_id": "uuid",
      "proficiency_level": 75,
      "last_interaction": "2023-06-15T10:30:00Z",
      "completed": true,
      "topic": {
        "name": "Topic Name",
        "description": "Topic Description",
        "difficulty_level": 3
      }
    }
  ],
  "stats": {
    "completedTopics": 5,
    "totalTopics": 10,
    "averageProficiency": 65,
    "progressPercentage": 50
  }
}
```

#### GET /api/progress/summary

Returns a summary of user progress across all topics.

**Query Parameters:**
- `user_id` (required): User ID

**Response:**
```json
{
  "completedTopics": 5,
  "totalTopics": 10,
  "progressPercentage": 50,
  "averageProficiency": 65,
  "recentAssessments": [...],
  "recentAssessmentScore": 85,
  "achievementCount": 8,
  "recentAchievements": [...]
}
```

### Achievements API

#### GET /api/achievements

Returns all achievements or achievements for a specific user.

**Query Parameters:**
- `user_id` (optional): User ID to get achievements for

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Achievement Name",
    "description": "Achievement Description",
    "criteria": {...},
    "icon_url": "https://example.com/icon.png",
    "earned_at": "2023-06-15T10:30:00Z"
  }
]
```

#### POST /api/achievements/user/check

Checks if a user qualifies for any new achievements.

**Request Body:**
```json
{
  "user_id": "uuid"
}
```

**Response:**
```json
{
  "newAchievements": [...],
  "count": 2
}
```

### AI API

#### POST /api/ai/recommendations

Generates AI-powered learning recommendations.

**Request Body:**
```json
{
  "user_id": "uuid",
  "topic_id": "uuid" // optional
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "topic": {
        "id": "uuid",
        "name": "Topic Name",
        "description": "Topic Description",
        "difficulty_level": 3
      },
      "content": [...],
      "assessments": [...],
      "currentProficiency": 45
    }
  ],
  "timestamp": "2023-06-15T10:30:00Z"
}
```

#### POST /api/ai/explanations

Generates AI-powered explanations for content or questions using Retrieval Augmented Generation (RAG).

**Request Body:**
```json
{
  "user_id": "uuid",
  "content_id": "uuid", // optional
  "question_id": "uuid", // optional
  "query": "Explain the concept of X"
}
```

**Response:**
```json
{
  "query": "Explain the concept of X",
  "title": "Content Title",
  "explanation": "Detailed explanation...",
  "sources": [
    {
      "id": "uuid",
      "title": "Source Title",
      "source": "Topic: Topic Name"
    }
  ],
  "timestamp": "2023-06-15T10:30:00Z"
}
```

#### POST /api/ai/study-plans

Generates a personalized study plan based on user data.

**Request Body:**
```json
{
  "user_id": "uuid",
  "available_time": 10, // hours per week, optional
  "preferences": {
    "preferVideo": true,
    "preferInteractive": true,
    "preferMorningStudy": false,
    "preferWeekendStudy": true,
    "focusOnWeakAreas": true
  } // optional
}
```

**Response:**
```json
{
  "id": "uuid",
  "study_plan": {
    "userId": "uuid",
    "createdAt": "2023-06-15T10:30:00Z",
    "weeklyPlan": [
      {
        "day": "Monday",
        "topics": [
          {
            "topicId": "uuid",
            "name": "Topic Name",
            "durationMinutes": 60,
            "resources": [
              {
                "type": "video",
                "title": "Resource Title",
                "description": "Resource Description"
              }
            ]
          }
        ]
      }
    ],
    "estimatedCompletionWeeks": 4,
    "recommendations": [
      "Focus on topics with high priority first"
    ],
    "metadata": {
      "totalStudyTimeMinutes": 300,
      "totalStudyTimeHours": 5,
      "averageDailyTimeMinutes": 60,
      "topicCount": 5
    }
  },
  "created_at": "2023-06-15T10:30:00Z"
}
```

#### GET /api/ai/study-plans

Returns study plans for a user.

**Query Parameters:**
- `user_id` (required): User ID

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "plan_data": {...},
    "ai_generated": true,
    "created_at": "2023-06-15T10:30:00Z",
    "updated_at": "2023-06-15T10:30:00Z"
  }
]
```

#### POST /api/ai/quiz-generation

Generates quiz questions based on user data and topic.

**Request Body:**
```json
{
  "user_id": "uuid",
  "topic_id": "uuid",
  "question_types": ["multiple-choice", "short-answer", "coding"], // optional
  "number_of_questions": 5, // optional
  "difficulty_level": 3 // optional, 1-5
}
```

**Response:**
```json
{
  "assessment_id": "uuid",
  "title": "Topic Name Assessment",
  "description": "AI-generated assessment for Topic Name",
  "topic_id": "uuid",
  "questions": [
    {
      "id": "uuid",
      "assessment_id": "uuid",
      "question_text": "Question Text",
      "question_type": "multiple-choice",
      "options": [...],
      "correct_answer": "Answer",
      "difficulty_level": 3,
      "explanation": "Explanation"
    }
  ],
  "difficulty_level": 3,
  "created_at": "2023-06-15T10:30:00Z"
}
```

## GraphQL API

The GraphQL API is available at `/api/graphql` and provides a flexible way to query and mutate data.

### Queries

Example queries:

```graphql
# Get user progress with topic details
query GetUserProgress($userId: ID!) {
  userProgress(userId: $userId) {
    id
    proficiency_level
    completed
    topic {
      name
      description
    }
  }
}

# Get progress summary
query GetProgressSummary($userId: ID!) {
  progressSummary(userId: $userId) {
    completedTopics
    totalTopics
    progressPercentage
    averageProficiency
    recentAssessmentScore
    achievementCount
  }
}

# Get AI recommendations
query GetRecommendations($userId: ID!, $topicId: ID) {
  recommendations(userId: $userId, topicId: $topicId) {
    recommendations {
      topic {
        id
        name
        description
      }
      content {
        id
        title
        content_type
      }
      assessments {
        id
        title
      }
      currentProficiency
    }
    timestamp
  }
}
```

### Mutations

Example mutations:

```graphql
# Submit an assessment
mutation SubmitAssessment($userId: ID!, $assessmentId: ID!, $answers: JSON!) {
  submitAssessment(userId: $userId, assessmentId: $assessmentId, answers: $answers) {
    id
    score
    completed_at
  }
}

# Update user progress
mutation UpdateProgress($userId: ID!, $topicId: ID!, $proficiencyLevel: Int, $completed: Boolean) {
  updateProgress(userId: $userId, topicId: $topicId, proficiencyLevel: $proficiencyLevel, completed: $completed) {
    id
    proficiency_level
    completed
    last_interaction
  }
}

# Generate an explanation
mutation GenerateExplanation($userId: ID!, $contentId: ID, $query: String!) {
  generateExplanation(userId: $userId, contentId: $contentId, query: $query) {
    query
    explanation
    timestamp
  }
}
```

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages in case of failure:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

Error responses follow this format:

```json
{
  "error": "Error message",
  "details": [...] // Optional additional details
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse. The current limits are:

- 100 requests per minute per IP address
- 1000 requests per hour per user

When rate limits are exceeded, the API returns a `429 Too Many Requests` status code.
