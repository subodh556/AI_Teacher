# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the AI Teacher application to Vercel.

## Prerequisites

Before deploying to Vercel, ensure you have:

1. A [Vercel account](https://vercel.com/signup)
2. Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. All environment variables ready to be configured

## Deployment Steps

### 1. Connect Your Repository to Vercel

1. Log in to your Vercel account
2. Click "Add New..." and select "Project"
3. Import your Git repository
4. Select the repository containing your AI Teacher project
5. Vercel will automatically detect that it's a Next.js project

### 2. Configure Project Settings

1. **Project Name**: Enter a name for your project (e.g., "ai-teacher")
2. **Framework Preset**: Ensure "Next.js" is selected
3. **Root Directory**: Leave as default if your project is in the root of the repository
4. **Build and Output Settings**: The default settings should work, but you can customize if needed:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 3. Configure Environment Variables

Add all required environment variables from your `.env.example` file:

1. Click on "Environment Variables" section
2. Add each variable from your `.env.example` file with its production value:
   - `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL (can be added after first deployment)
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `CLERK_SECRET_KEY`: Your Clerk secret key
   - `DATABASE_URL`: Your production database URL
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `GEMINI_API_KEY`: Your Gemini API key
   - `NEXT_PUBLIC_VERCEL_ANALYTICS`: Set to "true"
   - `NEXT_PUBLIC_VERCEL_WEB_VITALS`: Set to "true"
3. Click "Save" to store your environment variables

### 4. Deploy Your Project

1. Click "Deploy" to start the deployment process
2. Vercel will clone your repository, install dependencies, build the project, and deploy it
3. Once deployment is complete, you'll receive a URL for your deployed application

### 5. Set Up Custom Domain (Optional)

1. Go to the "Domains" tab in your project settings
2. Click "Add" and enter your custom domain
3. Follow the instructions to configure DNS settings for your domain

### 6. Configure Vercel Analytics

Vercel Analytics is automatically enabled when you deploy with the environment variables set correctly:

1. Go to the "Analytics" tab in your project dashboard
2. You'll see analytics data once your application starts receiving traffic
3. You can configure additional settings like custom events tracking

### 7. Set Up Preview Deployments

Preview deployments are automatically enabled for pull requests:

1. When you create a pull request in your Git repository, Vercel will create a preview deployment
2. You can access the preview deployment from the pull request or from the Vercel dashboard
3. This allows you to test changes before merging them into the main branch

### 8. Configure Monitoring and Alerts

1. Go to the "Monitoring" tab in your project dashboard
2. Set up alerts for errors, performance issues, and other metrics
3. Configure notification channels (email, Slack, etc.)

## Troubleshooting

If you encounter issues during deployment:

1. Check the build logs for errors
2. Verify that all environment variables are correctly set
3. Ensure your database is accessible from Vercel's servers
4. Check that your Clerk and Supabase configurations are correct

## Maintenance

To update your deployed application:

1. Push changes to your Git repository
2. Vercel will automatically rebuild and redeploy your application
3. Monitor the deployment logs for any issues

## Security Best Practices

1. Never commit sensitive environment variables to your repository
2. Use Vercel's environment variables for all sensitive information
3. Set up branch protection rules in your Git repository
4. Regularly update dependencies to patch security vulnerabilities

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli) for advanced deployment options
