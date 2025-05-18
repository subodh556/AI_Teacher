/**
 * GraphQL Schema
 * 
 * This file defines the GraphQL schema for the application.
 */

export const typeDefs = /* GraphQL */ `
  scalar DateTime
  scalar JSON

  type User {
    id: ID!
    email: String!
    name: String!
    created_at: DateTime!
    last_login: DateTime
    preferences: JSON
    progress: [UserProgress!]
    assessments: [UserAssessment!]
    achievements: [UserAchievement!]
    studyPlans: [StudyPlan!]
  }

  type Topic {
    id: ID!
    name: String!
    description: String!
    parent_id: ID
    parent: Topic
    children: [Topic!]
    difficulty_level: Int!
    content: [Content!]
    assessments: [Assessment!]
    userProgress: [UserProgress!]
  }

  type Content {
    id: ID!
    topic_id: ID!
    topic: Topic!
    title: String!
    content_type: String!
    content_data: JSON!
    difficulty_level: Int!
  }

  type Assessment {
    id: ID!
    title: String!
    description: String!
    topic_id: ID!
    topic: Topic!
    adaptive: Boolean!
    questions: [Question!]
    userAssessments: [UserAssessment!]
  }

  type Question {
    id: ID!
    assessment_id: ID!
    assessment: Assessment!
    question_text: String!
    question_type: String!
    options: JSON
    correct_answer: String!
    difficulty_level: Int!
    explanation: String!
  }

  type UserProgress {
    id: ID!
    user_id: ID!
    user: User!
    topic_id: ID!
    topic: Topic!
    proficiency_level: Int!
    last_interaction: DateTime
    completed: Boolean!
  }

  type UserAssessment {
    id: ID!
    user_id: ID!
    user: User!
    assessment_id: ID!
    assessment: Assessment!
    score: Int!
    completed_at: DateTime
    answers: JSON!
  }

  type Achievement {
    id: ID!
    name: String!
    description: String!
    criteria: JSON!
    icon_url: String
    userAchievements: [UserAchievement!]
  }

  type UserAchievement {
    id: ID!
    user_id: ID!
    user: User!
    achievement_id: ID!
    achievement: Achievement!
    earned_at: DateTime
  }

  type StudyPlan {
    id: ID!
    user_id: ID!
    user: User!
    created_at: DateTime!
    updated_at: DateTime!
    plan_data: JSON!
    ai_generated: Boolean!
  }

  type ProgressSummary {
    completedTopics: Int!
    totalTopics: Int!
    progressPercentage: Int!
    averageProficiency: Float!
    recentAssessments: [UserAssessment!]
    recentAssessmentScore: Int
    achievementCount: Int!
    recentAchievements: [Achievement!]
  }

  type Recommendation {
    topic: Topic!
    content: [Content!]
    assessments: [Assessment!]
    currentProficiency: Int!
  }

  type RecommendationResponse {
    recommendations: [Recommendation!]!
    timestamp: DateTime!
  }

  type ExplanationResponse {
    query: String!
    title: String!
    explanation: String!
    sources: [ExplanationSource!]
    timestamp: DateTime!
  }

  type ExplanationSource {
    title: String!
    content: String!
  }

  type Query {
    # User queries
    user(id: ID!): User
    users: [User!]!
    
    # Topic queries
    topic(id: ID!): Topic
    topics(parentId: ID): [Topic!]!
    
    # Content queries
    content(id: ID!): Content
    contentByTopic(topicId: ID!): [Content!]!
    
    # Assessment queries
    assessment(id: ID!): Assessment
    assessmentsByTopic(topicId: ID!): [Assessment!]!
    
    # Question queries
    question(id: ID!): Question
    questionsByAssessment(assessmentId: ID!): [Question!]!
    
    # Progress queries
    userProgress(userId: ID!): [UserProgress!]!
    progressSummary(userId: ID!): ProgressSummary!
    
    # Assessment result queries
    userAssessments(userId: ID!): [UserAssessment!]!
    
    # Achievement queries
    achievements: [Achievement!]!
    userAchievements(userId: ID!): [UserAchievement!]!
    
    # Study plan queries
    studyPlans(userId: ID!): [StudyPlan!]!
    
    # AI queries
    recommendations(userId: ID!, topicId: ID): RecommendationResponse!
  }

  type Mutation {
    # User mutations
    createUser(email: String!, name: String!): User!
    updateUser(id: ID!, name: String, preferences: JSON): User!
    
    # Topic mutations
    createTopic(name: String!, description: String!, parentId: ID, difficultyLevel: Int!): Topic!
    updateTopic(id: ID!, name: String, description: String, parentId: ID, difficultyLevel: Int): Topic!
    deleteTopic(id: ID!): Boolean!
    
    # Content mutations
    createContent(topicId: ID!, title: String!, contentType: String!, contentData: JSON!, difficultyLevel: Int!): Content!
    updateContent(id: ID!, title: String, contentType: String, contentData: JSON, difficultyLevel: Int): Content!
    deleteContent(id: ID!): Boolean!
    
    # Assessment mutations
    createAssessment(title: String!, description: String!, topicId: ID!, adaptive: Boolean): Assessment!
    updateAssessment(id: ID!, title: String, description: String, adaptive: Boolean): Assessment!
    deleteAssessment(id: ID!): Boolean!
    
    # Question mutations
    createQuestion(assessmentId: ID!, questionText: String!, questionType: String!, options: JSON, correctAnswer: String!, difficultyLevel: Int!, explanation: String!): Question!
    updateQuestion(id: ID!, questionText: String, questionType: String, options: JSON, correctAnswer: String, difficultyLevel: Int, explanation: String): Question!
    deleteQuestion(id: ID!): Boolean!
    
    # Progress mutations
    updateProgress(userId: ID!, topicId: ID!, proficiencyLevel: Int, completed: Boolean): UserProgress!
    
    # Assessment submission
    submitAssessment(userId: ID!, assessmentId: ID!, answers: JSON!): UserAssessment!
    
    # Achievement mutations
    createAchievement(name: String!, description: String!, criteria: JSON!, iconUrl: String): Achievement!
    awardAchievement(userId: ID!, achievementId: ID!): UserAchievement!
    checkAchievements(userId: ID!): Int!
    
    # Study plan mutations
    createStudyPlan(userId: ID!, planData: JSON!, aiGenerated: Boolean): StudyPlan!
    updateStudyPlan(id: ID!, planData: JSON, aiGenerated: Boolean): StudyPlan!
    deleteStudyPlan(id: ID!): Boolean!
    
    # AI mutations
    generateExplanation(userId: ID!, contentId: ID, questionId: ID, query: String!): ExplanationResponse!
  }
`;
