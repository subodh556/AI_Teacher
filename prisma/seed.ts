/**
 * Prisma Seed Script
 * 
 * This script populates the database with initial data for development.
 * It creates sample users, topics, content, assessments, questions, and achievements.
 */

import { PrismaClient } from '@/generated/prisma';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clean up existing data
  await cleanDatabase();

  // Create users
  const user1 = await createUser('user1@example.com', 'John Doe');
  const user2 = await createUser('user2@example.com', 'Jane Smith');

  // Create topics
  const programmingTopic = await createTopic('Programming Fundamentals', 'Introduction to programming concepts', null, 1);
  const algorithmsTopic = await createTopic('Algorithms', 'Study of algorithms and their complexity', null, 2);
  const javaScriptTopic = await createTopic('JavaScript', 'Learn JavaScript programming language', programmingTopic.id, 2);
  const pythonTopic = await createTopic('Python', 'Learn Python programming language', programmingTopic.id, 1);
  const sortingTopic = await createTopic('Sorting Algorithms', 'Different sorting algorithms and their implementations', algorithmsTopic.id, 3);

  // Create content
  await createContent(javaScriptTopic.id, 'JavaScript Variables', 'text', {
    sections: [
      { title: 'Introduction', content: 'Variables are containers for storing data values.' },
      { title: 'Declaration', content: 'In JavaScript, variables are declared using var, let, or const.' }
    ]
  }, 1);

  await createContent(pythonTopic.id, 'Python Basics', 'text', {
    sections: [
      { title: 'Introduction', content: 'Python is a high-level, interpreted programming language.' },
      { title: 'Variables', content: 'Python variables do not need explicit declaration.' }
    ]
  }, 1);

  // Create assessments and questions
  const jsAssessment = await createAssessment('JavaScript Basics', 'Test your knowledge of JavaScript basics', javaScriptTopic.id, true);
  
  await createQuestion(
    jsAssessment.id,
    'Which keyword is used to declare a constant in JavaScript?',
    'multiple-choice',
    { options: ['var', 'let', 'const', 'def'] },
    'const',
    2,
    'The const keyword is used to declare constants in JavaScript. Constants cannot be reassigned after declaration.'
  );

  await createQuestion(
    jsAssessment.id,
    'Write a function that adds two numbers.',
    'coding',
    null,
    'function add(a, b) { return a + b; }',
    3,
    'A simple function that takes two parameters and returns their sum.'
  );

  // Create achievements
  const achievement1 = await createAchievement(
    'JavaScript Master',
    'Complete all JavaScript lessons with at least 90% proficiency',
    { requiredTopics: [javaScriptTopic.id], minProficiency: 90 },
    '/images/achievements/js-master.png'
  );

  const achievement2 = await createAchievement(
    'Python Explorer',
    'Complete your first Python assessment',
    { requiredAssessments: 1, topics: [pythonTopic.id] },
    '/images/achievements/python-explorer.png'
  );

  // Create user progress
  await createUserProgress(user1.id, javaScriptTopic.id, 75, false);
  await createUserProgress(user1.id, pythonTopic.id, 40, false);
  await createUserProgress(user2.id, javaScriptTopic.id, 90, true);

  // Create user achievements
  await createUserAchievement(user2.id, achievement1.id);

  // Create study plan
  await createStudyPlan(user1.id, {
    topics: [
      { id: javaScriptTopic.id, priority: 'high' },
      { id: pythonTopic.id, priority: 'medium' }
    ],
    schedule: {
      monday: [javaScriptTopic.id],
      wednesday: [pythonTopic.id],
      friday: [javaScriptTopic.id]
    }
  }, true);

  console.log('Seed completed successfully!');
}

// Helper functions for creating entities

async function cleanDatabase() {
  // Delete in reverse order of dependencies
  await prisma.userAchievement.deleteMany();
  await prisma.userAssessment.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.studyPlan.deleteMany();
  await prisma.question.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.content.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.user.deleteMany();
}

async function createUser(email: string, name: string) {
  return prisma.user.create({
    data: {
      id: uuidv4(),
      email,
      name,
      created_at: new Date(),
      preferences: {}
    }
  });
}

async function createTopic(name: string, description: string, parentId: string | null, difficultyLevel: number) {
  return prisma.topic.create({
    data: {
      id: uuidv4(),
      name,
      description,
      parent_id: parentId,
      difficulty_level: difficultyLevel
    }
  });
}

async function createContent(topicId: string, title: string, contentType: string, contentData: any, difficultyLevel: number) {
  return prisma.content.create({
    data: {
      id: uuidv4(),
      topic_id: topicId,
      title,
      content_type: contentType,
      content_data: contentData,
      difficulty_level: difficultyLevel
    }
  });
}

async function createAssessment(title: string, description: string, topicId: string, adaptive: boolean) {
  return prisma.assessment.create({
    data: {
      id: uuidv4(),
      title,
      description,
      topic_id: topicId,
      adaptive
    }
  });
}

async function createQuestion(
  assessmentId: string,
  questionText: string,
  questionType: string,
  options: any,
  correctAnswer: string,
  difficultyLevel: number,
  explanation: string
) {
  return prisma.question.create({
    data: {
      id: uuidv4(),
      assessment_id: assessmentId,
      question_text: questionText,
      question_type: questionType,
      options,
      correct_answer: correctAnswer,
      difficulty_level: difficultyLevel,
      explanation
    }
  });
}

async function createAchievement(name: string, description: string, criteria: any, iconUrl: string) {
  return prisma.achievement.create({
    data: {
      id: uuidv4(),
      name,
      description,
      criteria,
      icon_url: iconUrl
    }
  });
}

async function createUserProgress(userId: string, topicId: string, proficiencyLevel: number, completed: boolean) {
  return prisma.userProgress.create({
    data: {
      id: uuidv4(),
      user_id: userId,
      topic_id: topicId,
      proficiency_level: proficiencyLevel,
      last_interaction: new Date(),
      completed
    }
  });
}

async function createUserAchievement(userId: string, achievementId: string) {
  return prisma.userAchievement.create({
    data: {
      id: uuidv4(),
      user_id: userId,
      achievement_id: achievementId,
      earned_at: new Date()
    }
  });
}

async function createStudyPlan(userId: string, planData: any, aiGenerated: boolean) {
  return prisma.studyPlan.create({
    data: {
      id: uuidv4(),
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
      plan_data: planData,
      ai_generated: aiGenerated
    }
  });
}

// Execute the main function
main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma client connection
    await prisma.$disconnect();
  });
