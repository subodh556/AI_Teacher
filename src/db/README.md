# Supabase Database Setup

This document provides instructions for setting up the Supabase project and database for the AI Teacher application.

## Creating a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in.
2. Create a new project by clicking "New Project".
3. Enter a name for your project and set a secure database password.
4. Choose a region closest to your users.
5. Click "Create new project".

## Setting Up Environment Variables

Once your project is created, you need to set up the environment variables:

1. In your Supabase project dashboard, go to "Settings" > "API".
2. Copy the "Project URL" and add it to your `.env.local` file as `NEXT_PUBLIC_SUPABASE_URL`.
3. Copy the "anon" key and add it to your `.env.local` file as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copy the "service_role" key and add it to your `.env.local` file as `SUPABASE_SERVICE_ROLE_KEY`.

## Setting Up Database Schema

You can set up the database schema in two ways:

### Option 1: Using the SQL Editor

1. In your Supabase project dashboard, go to "SQL Editor".
2. Create a new query.
3. Copy the contents of `schema.sql` from this directory.
4. Run the query to create all tables and set up RLS policies.

### Option 2: Using the Supabase CLI

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Initialize Supabase in your project:
   ```bash
   supabase init
   ```

4. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

5. Push the schema:
   ```bash
   supabase db push
   ```

## Configuring Authentication

1. In your Supabase project dashboard, go to "Authentication" > "Providers".
2. Enable "Email" provider.
3. Configure any additional providers as needed (Google, GitHub, etc.).
4. Go to "Authentication" > "URL Configuration".
5. Add your site URL and any additional redirect URLs.

## Setting Up Row Level Security

The `schema.sql` file already includes RLS policies for all tables. These policies ensure that:

- Users can only access their own data.
- Public data (topics, content, etc.) is accessible to all users.
- Users can only modify their own data.

## Setting Up Realtime Subscriptions

The `schema.sql` file also sets up realtime subscriptions for the following tables:

- UserProgress
- UserAssessments
- UserAchievements
- StudyPlans

This allows the application to receive real-time updates when data changes.

## Testing the Setup

After setting up the database, you can test it by:

1. Running the application locally:
   ```bash
   npm run dev
   ```

2. Creating a new user account.
3. Verifying that you can access and modify your own data.
4. Verifying that realtime subscriptions work correctly.

## Troubleshooting

If you encounter any issues:

1. Check that your environment variables are set correctly.
2. Verify that the database schema was created successfully.
3. Check the RLS policies to ensure they're working as expected.
4. Check the Supabase logs for any errors.

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Subscriptions](https://supabase.com/docs/guides/realtime)
