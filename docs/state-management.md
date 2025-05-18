# State Management Patterns

This document outlines the state management patterns used in the AI Teacher application.

## Overview

The application uses a combination of state management approaches:

1. **React Context API** for global UI state
2. **Server Components** for data fetching and rendering
3. **React Query** for client-side data fetching, caching, and synchronization
4. **Local Component State** for UI-specific interactions
5. **Zustand** for complex client-side state management
6. **Server Actions** for form submissions and data mutations

## When to Use Each Approach

### React Context API

Used for:
- Global UI state that needs to be accessed by many components
- Theme management
- Authentication state
- UI layout configuration

Implementation:
- `ThemeProvider` - Manages light/dark mode
- `AuthProvider` - Manages authentication state
- `UIProvider` - Manages UI layout state (sidebar, panels, etc.)

### Server Components

Used for:
- Initial data fetching
- SEO-critical content
- Static or rarely changing content
- Content that doesn't need client-side interactivity

Implementation:
- Server components fetch data directly from the database or API
- Data is rendered on the server and sent to the client as HTML
- No client-side JavaScript is needed for rendering

### React Query

Used for:
- Client-side data fetching
- Data caching and synchronization
- Optimistic updates
- Background refetching
- Pagination and infinite scrolling

Implementation:
- `QueryProvider` - Provides React Query context
- Custom hooks for data fetching:
  - `useTopics` - Fetches topics
  - `useAssessment` - Fetches assessment data
  - `useUserProgress` - Fetches user progress

### Local Component State

Used for:
- UI-specific interactions
- Form input state
- Component-specific state that doesn't need to be shared

Implementation:
- React's `useState` and `useReducer` hooks
- Used for temporary state that doesn't need to persist

### Zustand

Used for:
- Complex client-side state management
- State that needs to persist across page navigations
- State that needs to be accessed by multiple components
- State that needs to be updated from multiple places

Implementation:
- `ui-store.ts` - Manages UI state
- `editor-store.ts` - Manages code editor state
- `assessment-store.ts` - Manages assessment state
- `progress-store.ts` - Manages progress tracking

### Server Actions

Used for:
- Form submissions
- Data mutations
- Authentication actions
- Any action that modifies data on the server

Implementation:
- API routes in `src/app/api/`
- Server actions for form submissions and data mutations

## Data Flow

1. **Initial Page Load**:
   - Server components fetch initial data
   - Data is rendered on the server and sent to the client

2. **Client-Side Interactions**:
   - Local component state manages UI interactions
   - Zustand stores manage complex state
   - React Query manages data fetching and caching

3. **Data Mutations**:
   - Server actions handle form submissions and data mutations
   - React Query invalidates affected queries
   - Optimistic updates provide immediate feedback

4. **Real-Time Updates**:
   - Webhook integration for real-time notifications
   - Event-driven architecture for gamification triggers

## Best Practices

1. **Use the Right Tool for the Job**:
   - Use server components for initial data fetching
   - Use React Query for client-side data fetching
   - Use Zustand for complex client-side state
   - Use local component state for UI-specific interactions

2. **Keep State Minimal and Focused**:
   - Each store should have a single responsibility
   - Avoid duplicating state across stores
   - Use selectors to derive state when possible

3. **Optimize for Performance**:
   - Use React Query's caching and background refetching
   - Use server components for static content
   - Use optimistic updates for immediate feedback

4. **Handle Errors Gracefully**:
   - Use React Query's error handling
   - Provide fallback UI for error states
   - Log errors for debugging

5. **Document State Management Decisions**:
   - Document the purpose of each store
   - Document the data flow for complex interactions
   - Document the rationale for state management decisions
