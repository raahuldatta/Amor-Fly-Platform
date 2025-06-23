-- Create users table for Supabase
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image_url TEXT,
    profile JSONB DEFAULT '{}',
    selected_skills TEXT[] DEFAULT '{}',
    personality_answers JSONB DEFAULT '{}',
    anonymous_name TEXT,
    growth_points INTEGER DEFAULT 0,
    engagement_level INTEGER DEFAULT 0,
    weekly_connections_used INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = clerk_id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = clerk_id);

-- Create policy to allow service role to insert/update/delete (for webhooks)
CREATE POLICY "Service role can manage users" ON users
    FOR ALL USING (auth.role() = 'service_role');

-- Create skills table
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    skill_level TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_name)
);

-- Enable RLS for skills table
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

-- Create policies for skills table
CREATE POLICY "Users can view own skills" ON user_skills
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = user_skills.user_id 
            AND users.clerk_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can manage own skills" ON user_skills
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = user_skills.user_id 
            AND users.clerk_id = auth.uid()::text
        )
    );

CREATE POLICY "Service role can manage skills" ON user_skills
    FOR ALL USING (auth.role() = 'service_role'); 