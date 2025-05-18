-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMPTZ,
    "preferences" JSONB DEFAULT '{}',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "parent_id" UUID,
    "difficulty_level" INTEGER NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" UUID NOT NULL,
    "topic_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "content_data" JSONB NOT NULL,
    "difficulty_level" INTEGER NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "topic_id" UUID NOT NULL,
    "adaptive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" UUID NOT NULL,
    "assessment_id" UUID NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_type" TEXT NOT NULL,
    "options" JSONB,
    "correct_answer" TEXT NOT NULL,
    "difficulty_level" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "topic_id" UUID NOT NULL,
    "proficiency_level" INTEGER NOT NULL,
    "last_interaction" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAssessment" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "assessment_id" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "completed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answers" JSONB NOT NULL,

    CONSTRAINT "UserAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "icon_url" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "achievement_id" UUID NOT NULL,
    "earned_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyPlan" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plan_data" JSONB NOT NULL,
    "ai_generated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StudyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_user_id_topic_id_key" ON "UserProgress"("user_id", "topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_user_id_achievement_id_key" ON "UserAchievement"("user_id", "achievement_id");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssessment" ADD CONSTRAINT "UserAssessment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssessment" ADD CONSTRAINT "UserAssessment_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyPlan" ADD CONSTRAINT "StudyPlan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
