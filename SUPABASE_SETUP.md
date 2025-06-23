# Supabase Setup Guide

This guide will help you set up Supabase to replace MongoDB for user management in your Amor Fly platform.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account or sign in
2. Create a new project
3. Note down your project URL and API keys

## 2. Set Up Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Keep your existing Clerk configuration
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

## 3. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `scripts/supabase-setup.sql`

This will create:
- `users` table with all necessary fields
- `user_skills` table for managing user skills
- Proper indexes and Row Level Security (RLS) policies

## 4. Update Clerk Webhook

1. Go to your Clerk Dashboard
2. Navigate to Webhooks
3. Update your webhook endpoint to point to: `https://your-domain.com/api/webhooks/clerk`
4. Make sure the webhook secret matches your `CLERK_WEBHOOK_SECRET`

## 5. Test the Setup

1. Start your development server: `npm run dev`
2. Sign up with a new user through Clerk
3. Check the server logs for webhook activity
4. Verify the user was created in Supabase (check the `users` table)
5. Try accessing the dashboard

## 6. Database Schema Overview

### Users Table
- `id`: UUID primary key
- `clerk_id`: Clerk user ID (unique)
- `email`: User email (unique)
- `name`: User's full name
- `image_url`: Profile image URL
- `profile`: JSON object for additional profile data
- `selected_skills`: Array of skill names
- `personality_answers`: JSON object for personality quiz answers
- `anonymous_name`: Anonymous display name
- `growth_points`: User's growth points
- `engagement_level`: User's engagement level (0-100)
- `weekly_connections_used`: Number of connections used this week
- `is_active`: Whether the user account is active
- `is_verified`: Whether the user is verified
- `role`: User role (user, admin, etc.)
- `created_at`, `updated_at`, `last_active`: Timestamps

### User Skills Table
- `id`: UUID primary key
- `user_id`: Reference to users table
- `skill_name`: Name of the skill
- `skill_level`: Level of proficiency (beginner, intermediate, advanced, expert)
- `created_at`: When the skill was added

## 7. Troubleshooting

### User not found in dashboard
- Check if the webhook fired when you signed up
- Verify the user exists in the `users` table
- Check that the `clerk_id` matches your Clerk user ID

### Skills not loading
- Verify the `user_skills` table was created
- Check that RLS policies are properly configured
- Ensure the service role key has proper permissions

### Webhook errors
- Verify the webhook secret matches
- Check that the webhook URL is accessible
- Review server logs for detailed error messages

## 8. Migration from MongoDB (if applicable)

If you have existing data in MongoDB, you'll need to:
1. Export your MongoDB data
2. Transform it to match the Supabase schema
3. Import it into Supabase using the SQL editor or API

## 9. Security Notes

- The service role key has full access to your database - keep it secure
- RLS policies ensure users can only access their own data
- The webhook uses the service role to create users
- All client-side operations use the anon key with RLS restrictions 