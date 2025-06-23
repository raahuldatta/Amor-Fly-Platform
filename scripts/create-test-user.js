const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  console.log('🚀 Creating test user in Supabase...');
  
  const testUser = {
    clerk_id: 'user_2ymZthMmU9cBBcCiKNSupgfq9EU',
    email: 'test@example.com', // You can update this
    name: 'Test User',
    image_url: '',
    profile: {
      bio: "",
      avatar: "",
      skills: [],
      location: "",
      interests: []
    },
    selected_skills: [],
    personality_answers: {},
    anonymous_name: 'User1234',
    growth_points: 0,
    engagement_level: 0,
    weekly_connections_used: 0,
    is_active: true,
    is_verified: true,
    role: 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_active: new Date().toISOString(),
  };

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', testUser.clerk_id)
      .single();

    if (existingUser) {
      console.log('✅ User already exists in Supabase');
      return;
    }

    // Create the user
    const { data, error } = await supabase
      .from('users')
      .insert([testUser])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating user:', error);
      return;
    }

    console.log('✅ Test user created successfully!');
    console.log('User ID:', data.id);
    console.log('Clerk ID:', data.clerk_id);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testUserFetch() {
  console.log('\n🔍 Testing user fetch...');
  
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', 'user_2ymZthMmU9cBBcCiKNSupgfq9EU')
      .single();

    if (error) {
      console.error('❌ Error fetching user:', error);
    } else {
      console.log('✅ User found in Supabase:');
      console.log('- ID:', user.id);
      console.log('- Email:', user.email);
      console.log('- Name:', user.name);
      console.log('- Anonymous Name:', user.anonymous_name);
    }
  } catch (error) {
    console.error('❌ Error testing fetch:', error.message);
  }
}

async function main() {
  await createTestUser();
  await testUserFetch();
  
  console.log('\n🎉 Test complete!');
  console.log('📝 Now try accessing the dashboard again.');
}

main().catch(console.error); 