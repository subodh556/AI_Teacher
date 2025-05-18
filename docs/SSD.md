# Software Requirements Specification Document

## System Design
- Full-stack web application with responsive design
- IDE-inspired interface with dark mode theme
- Modular architecture with clear separation of concerns
- Real-time assessment and feedback system
- Personalized learning path generation using AI
- Gamification elements integrated throughout the experience

## Architecture Pattern
- Next.js App Router architecture with React Server Components
- Next.js 14 folder structure for maintainability
- API routes for backend functionality
- Server-side rendering for improved SEO and initial load performance
- Client-side interactivity for dynamic learning experiences
- Microservices approach for AI components and assessment engine

## State Management
- React Context API for global UI state
- Server components for data fetching and rendering
- React Query for client-side data fetching, caching, and synchronization
- Local component state for UI-specific interactions
- Zustand for complex client-side state management
- Server actions for form submissions and data mutations

## Data Flow
- Server-side data fetching for initial page loads
- Client-side updates for interactive elements
- Webhook integration for real-time notifications
- Event-driven architecture for gamification triggers
- Streaming responses for AI-generated content
- Optimistic UI updates for immediate feedback

## Technical Stack
- **Frontend**: Next.js 14+, React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Next.js API routes, Typescript, supabase
- **Database**: PostgreSQL with Prisma ORM, Supabase for auth and realtime features
- **AI Integration**: LangChain, Gemini API, Retrieval Augmented Generation
- **Deployment**: Vercel for hosting and serverless functions
- **Analytics**: Vercel Analytics

## Authentication Process
- User registration and login managed via Clerk Auth.
- Secure session management with token storage.
- Progressive profiling during onboarding

## Route Design
- `/` - Landing page with product information
- `/dashboard` - Main student dashboard with progress overview
- `/learn/[topic]` - Learning content for specific topics
- `/practice/[topic]` - Interactive exercises and coding challenges
- `/assessment/[id]` - Adaptive assessment interface
- `/progress` - Detailed analytics and progress visualization
- `/achievements` - Gamification elements and badges showcase
- `/settings` - User profile and preferences management
- `/api/*` - Backend API endpoints

## API Design
- RESTful API design principles with resource-based URLs
- GraphQL endpoint for complex data queries
- Endpoints:
  - `/api/assessment/*` - Quiz and assessment functionality
  - `/api/learning/*` - Content and study plan management
  - `/api/progress/*` - User progress tracking
  - `/api/achievements/*` - Gamification system
  - `/api/ai/*` - AI-powered recommendations and explanations

## Database Design ERD
- **Users**
  - id (PK)
  - email
  - name
  - created_at
  - last_login
  - preferences (JSONB)

- **Topics**
  - id (PK)
  - name
  - description
  - parent_id (FK to Topics, for hierarchical structure)
  - difficulty_level

- **Content**
  - id (PK)
  - topic_id (FK to Topics)
  - title
  - content_type (text, video, interactive)
  - content_data (JSONB)
  - difficulty_level

- **Assessments**
  - id (PK)
  - title
  - description
  - topic_id (FK to Topics)
  - adaptive (boolean)

- **Questions**
  - id (PK)
  - assessment_id (FK to Assessments)
  - question_text
  - question_type (multiple-choice, coding, short-answer)
  - options (JSONB, for multiple-choice)
  - correct_answer
  - difficulty_level
  - explanation

- **UserProgress**
  - id (PK)
  - user_id (FK to Users)
  - topic_id (FK to Topics)
  - proficiency_level
  - last_interaction
  - completed (boolean)

- **UserAssessments**
  - id (PK)
  - user_id (FK to Users)
  - assessment_id (FK to Assessments)
  - score
  - completed_at
  - answers (JSONB)

- **Achievements**
  - id (PK)
  - name
  - description
  - criteria (JSONB)
  - icon_url

- **UserAchievements**
  - id (PK)
  - user_id (FK to Users)
  - achievement_id (FK to Achievements)
  - earned_at

- **StudyPlans**
  - id (PK)
  - user_id (FK to Users)
  - created_at
  - updated_at
  - plan_data (JSONB)
  - ai_generated (boolean)