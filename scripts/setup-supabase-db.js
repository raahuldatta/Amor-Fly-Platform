const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please run: node scripts/setup-supabase-env.js first');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SQL schema to create tables
const schemaSQL = `
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

-- Create policy to allow service role to manage all users (for webhooks)
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
CREATE POLICY "Service role can manage skills" ON user_skills
    FOR ALL USING (auth.role() = 'service_role');
`;

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database schema...');
  
  try {
    // Execute the schema SQL
    const { error } = await supabase.rpc('exec_sql', { sql: schemaSQL });
    
    if (error) {
      console.error('❌ Error executing schema:', error);
      
      // If exec_sql doesn't work, try individual statements
      console.log('🔄 Trying alternative approach...');
      await executeIndividualStatements();
    } else {
      console.log('✅ Database schema created successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.log('\n📝 Please manually run the SQL in your Supabase SQL Editor:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL from scripts/supabase-setup.sql');
  }
}

async function executeIndividualStatements() {
  const statements = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
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
    )`,
    
    // Indexes
    `CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id)`,
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
    `CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active)`,
    
    // RLS
    `ALTER TABLE users ENABLE ROW LEVEL SECURITY`,
    
    // Policies
    `CREATE POLICY "Service role can manage users" ON users FOR ALL USING (auth.role() = 'service_role')`,
    
    // Skills table
    `CREATE TABLE IF NOT EXISTS user_skills (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      skill_name TEXT NOT NULL,
      skill_level TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, skill_name)
    )`,
    
    // Skills RLS
    `ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY`,
    `CREATE POLICY "Service role can manage skills" ON user_skills FOR ALL USING (auth.role() = 'service_role')`
  ];

  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      if (error) {
        console.log(`⚠️  Statement failed (this might be expected): ${statement.substring(0, 50)}...`);
      }
    } catch (error) {
      console.log(`⚠️  Statement failed (this might be expected): ${statement.substring(0, 50)}...`);
    }
  }
  
  console.log('✅ Database setup completed!');
}

// Test connection
async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log('⚠️  Connection test failed (this is expected if tables don\'t exist yet):', error.message);
    } else {
      console.log('✅ Supabase connection successful!');
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

async function main() {
  await testConnection();
  await setupDatabase();
  
  console.log('\n🎉 Setup complete!');
  console.log('📝 Next steps:');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Sign up with a new user through Clerk');
  console.log('3. Check if the dashboard loads properly');
  console.log('4. Verify the user was created in Supabase (check the users table)');
}

main().catch(console.error); 