-- Create UserStreak table
CREATE TABLE IF NOT EXISTS "UserStreak" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL UNIQUE REFERENCES "User"(id),
  "current_streak" INTEGER NOT NULL DEFAULT 0,
  "longest_streak" INTEGER NOT NULL DEFAULT 0,
  "last_active" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create UserLevel table
CREATE TABLE IF NOT EXISTS "UserLevel" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL UNIQUE REFERENCES "User"(id),
  "current_level" INTEGER NOT NULL DEFAULT 1,
  "experience" INTEGER NOT NULL DEFAULT 0,
  "next_level_exp" INTEGER NOT NULL DEFAULT 100,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
