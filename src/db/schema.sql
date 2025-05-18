-- AI Teacher Database Schema
-- This script creates all the tables and RLS policies for the application

-- Users Table
CREATE TABLE IF NOT EXISTS "Users" (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{}'::JSONB
);

-- Topics Table
CREATE TABLE IF NOT EXISTS "Topics" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  parent_id UUID REFERENCES "Topics" (id),
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level BETWEEN 1 AND 5)
);

-- Content Table
CREATE TABLE IF NOT EXISTS "Content" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES "Topics" (id),
  title TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'video', 'interactive')),
  content_data JSONB NOT NULL,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level BETWEEN 1 AND 5)
);

-- Assessments Table
CREATE TABLE IF NOT EXISTS "Assessments" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  topic_id UUID NOT NULL REFERENCES "Topics" (id),
  adaptive BOOLEAN NOT NULL DEFAULT FALSE
);

-- Questions Table
CREATE TABLE IF NOT EXISTS "Questions" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES "Assessments" (id),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple-choice', 'coding', 'short-answer')),
  options JSONB,
  correct_answer TEXT NOT NULL,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level BETWEEN 1 AND 5),
  explanation TEXT NOT NULL
);

-- UserProgress Table
CREATE TABLE IF NOT EXISTS "UserProgress" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "Users" (id),
  topic_id UUID NOT NULL REFERENCES "Topics" (id),
  proficiency_level INTEGER NOT NULL CHECK (proficiency_level BETWEEN 0 AND 100),
  last_interaction TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (user_id, topic_id)
);

-- UserAssessments Table
CREATE TABLE IF NOT EXISTS "UserAssessments" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "Users" (id),
  assessment_id UUID NOT NULL REFERENCES "Assessments" (id),
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  answers JSONB NOT NULL
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS "Achievements" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  criteria JSONB NOT NULL,
  icon_url TEXT NOT NULL
);

-- UserAchievements Table
CREATE TABLE IF NOT EXISTS "UserAchievements" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "Users" (id),
  achievement_id UUID NOT NULL REFERENCES "Achievements" (id),
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, achievement_id)
);

-- StudyPlans Table
CREATE TABLE IF NOT EXISTS "StudyPlans" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "Users" (id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  plan_data JSONB NOT NULL,
  ai_generated BOOLEAN NOT NULL DEFAULT FALSE
);

-- Enable Row Level Security on all tables
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Topics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Content" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Assessments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Questions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserProgress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserAssessments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Achievements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserAchievements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StudyPlans" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
CREATE POLICY "Users can view their own profile" ON "Users"
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON "Users"
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Topics
CREATE POLICY "Anyone can view topics" ON "Topics"
  FOR SELECT USING (true);

-- RLS Policies for Content
CREATE POLICY "Anyone can view content" ON "Content"
  FOR SELECT USING (true);

-- RLS Policies for Assessments
CREATE POLICY "Anyone can view assessments" ON "Assessments"
  FOR SELECT USING (true);

-- RLS Policies for Questions
CREATE POLICY "Anyone can view questions" ON "Questions"
  FOR SELECT USING (true);

-- RLS Policies for UserProgress
CREATE POLICY "Users can view their own progress" ON "UserProgress"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON "UserProgress"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON "UserProgress"
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for UserAssessments
CREATE POLICY "Users can view their own assessment results" ON "UserAssessments"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessment results" ON "UserAssessments"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Achievements
CREATE POLICY "Anyone can view achievements" ON "Achievements"
  FOR SELECT USING (true);

-- RLS Policies for UserAchievements
CREATE POLICY "Users can view their own achievements" ON "UserAchievements"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can earn achievements" ON "UserAchievements"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for StudyPlans
CREATE POLICY "Users can view their own study plans" ON "StudyPlans"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study plans" ON "StudyPlans"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study plans" ON "StudyPlans"
  FOR UPDATE USING (auth.uid() = user_id);

-- Set up Realtime subscriptions
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE "UserProgress";
ALTER PUBLICATION supabase_realtime ADD TABLE "UserAssessments";
ALTER PUBLICATION supabase_realtime ADD TABLE "UserAchievements";
ALTER PUBLICATION supabase_realtime ADD TABLE "StudyPlans";
