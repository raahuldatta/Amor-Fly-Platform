const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

// Supabase configuration
const supabaseConfig = `
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pdspkeftywvnbffhtocu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkc3BrZWZ0eXd2bmJmZmh0b2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODk5OTEsImV4cCI6MjA2NjA2NTk5MX0.PzOBCV4htkpB70cH8EZZ4z6DeohtfF573AjKdGMrjB8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkc3BrZWZ0eXd2bmJmZmh0b2N1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQ4OTk5MSwiZXhwIjoyMDY2MDY1OTkxfQ.ad1Ffv6D50W0HUGvYQ5AStOdd3rPHiFmadN6bohrWYg
`;

// Read existing .env.local file
let existingContent = '';
try {
  existingContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.log('No existing .env.local file found, creating new one...');
}

// Check if Supabase config already exists
if (existingContent.includes('NEXT_PUBLIC_SUPABASE_URL')) {
  console.log('Supabase configuration already exists in .env.local');
  console.log('Please update the values manually if needed.');
} else {
  // Append Supabase config to existing content
  const newContent = existingContent + supabaseConfig;
  
  try {
    fs.writeFileSync(envPath, newContent);
    console.log('✅ Supabase environment variables added to .env.local');
    console.log('📝 Please review and update any existing Clerk configuration if needed.');
  } catch (error) {
    console.error('❌ Error writing to .env.local:', error.message);
    console.log('📝 Please manually add the following to your .env.local file:');
    console.log(supabaseConfig);
  }
}

console.log('\n🔧 Next steps:');
console.log('1. Run the database schema: node scripts/setup-supabase-db.js');
console.log('2. Start the development server: npm run dev');
console.log('3. Test the dashboard with a new user signup'); 