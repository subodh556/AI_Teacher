-- CreateTable
CREATE TABLE "UserGoal" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "target_value" INTEGER NOT NULL,
    "current_value" INTEGER NOT NULL DEFAULT 0,
    "goal_type" TEXT NOT NULL,
    "topic_id" UUID,
    "start_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "activity_type" TEXT NOT NULL,
    "activity_data" JSONB NOT NULL,
    "topic_id" UUID,
    "duration" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressMetric" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "metric_type" TEXT NOT NULL,
    "metric_value" DOUBLE PRECISION NOT NULL,
    "metric_data" JSONB,
    "date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgressMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStreak" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "last_active" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserStreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLevel" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "current_level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "next_level_exp" INTEGER NOT NULL DEFAULT 100,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStreak_user_id_key" ON "UserStreak"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserLevel_user_id_key" ON "UserLevel"("user_id");

-- AddForeignKey
ALTER TABLE "UserGoal" ADD CONSTRAINT "UserGoal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGoal" ADD CONSTRAINT "UserGoal_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressMetric" ADD CONSTRAINT "ProgressMetric_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStreak" ADD CONSTRAINT "UserStreak_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLevel" ADD CONSTRAINT "UserLevel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
