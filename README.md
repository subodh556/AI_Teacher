# AI Teacher

AI Teacher is a revolutionary educational platform that leverages artificial intelligence to deliver truly personalized learning experiences at scale. By continuously analyzing student interactions, the system identifies knowledge gaps, adapts content difficulty in real-time, and generates customized study plans tailored to individual learning patterns.

## Features

- **Personalized Learning Paths**: AI-generated study plans based on individual performance and learning patterns
- **Adaptive Assessments**: Quizzes that adjust difficulty based on user performance
- **Real-time Feedback**: Immediate, contextual explanations for incorrect answers
- **Progress Tracking**: Comprehensive analytics dashboard for visualizing progress
- **Gamification**: Achievement mechanisms including streaks, badges, and level progression

## Technology Stack

- **Frontend**: Next.js 14+, React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Next.js API routes, TypeScript, Supabase
- **Database**: PostgreSQL with Prisma ORM, Supabase for auth and realtime features
- **AI Integration**: LangChain, OpenAI API, Retrieval Augmented Generation
- **Deployment**: Vercel for hosting and serverless functions
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-teacher.git
   cd ai-teacher
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your configuration values.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
ai-teacher/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable components
│   │   ├── ui/              # UI components from shadcn/ui
│   │   └── ...              # Other components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── .env.example             # Example environment variables
├── .eslintrc.js             # ESLint configuration
├── .prettierrc              # Prettier configuration
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Development Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Add your feature description"
   ```

3. Push your branch to the remote repository:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request on GitHub.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.io/)
- [Vercel](https://vercel.com/)
