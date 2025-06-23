const fs = require('fs');
const path = require('path');

// Files that need to be updated
const filesToUpdate = [
  'app/api/notifications/route.ts',
  'app/api/pods/route.ts',
  'app/api/pods/[id]/route.ts',
  'app/api/user/profile/route.ts',
  'app/api/connections/active/route.ts',
  'app/api/notifications/[id]/read/route.ts',
  'app/api/pods/[id]/messages/route.ts',
  'app/api/pods/analytics/route.ts',
  'app/api/pods/match/route.ts',
  'app/api/connections/potential/route.ts',
  'app/api/connections/requests/route.ts',
  'app/api/pods/[id]/messages/[messageId]/like/route.ts',
  'app/api/connections/request/route.ts',
  'app/api/connections/requests/[id]/route.ts',
  'app/api/admin/stats/route.ts',
  'app/api/chat/[id]/route.ts',
  'app/api/admin/reports/route.ts',
  'app/api/admin/reports/[id]/route.ts',
  'app/api/chat/[id]/messages/route.ts',
  'app/api/admin/users/route.ts',
  'app/api/admin/pods/route.ts',
  'app/api/admin/users/[id]/route.ts'
];

function updateFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Replace MongoDB import with Supabase
  content = content.replace(
    /import\s+\{\s*connectToDatabase\s*\}\s+from\s+["']@\/lib\/mongodb["']/g,
    "import { createServerSupabaseClient } from '@/lib/supabase'"
  );
  
  // Replace MongoDB usage with basic Supabase placeholder
  content = content.replace(
    /const\s+\{\s*db\s*\}\s*=\s*await\s*connectToDatabase\(\)/g,
    "const supabase = createServerSupabaseClient()"
  );
  
  // Add basic placeholder response for routes that might be called
  if (content.includes('export async function GET') || content.includes('export async function POST')) {
    // Add a simple placeholder response
    const placeholderResponse = `
// TODO: Implement with Supabase
return NextResponse.json({ message: "Not implemented yet" }, { status: 501 });
`;
    
    // Find the function and add placeholder
    content = content.replace(
      /(\s*return\s+NextResponse\.json\([^)]+\))/g,
      placeholderResponse
    );
  }
  
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Updated: ${filePath}`);
}

console.log('🔄 Updating MongoDB imports to Supabase...');

filesToUpdate.forEach(updateFile);

console.log('\n🎉 All files updated!');
console.log('📝 Note: Some API routes now return placeholder responses.');
console.log('🔧 You can implement the actual Supabase logic as needed.'); 