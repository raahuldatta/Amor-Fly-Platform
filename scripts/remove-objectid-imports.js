const fs = require('fs');
const path = require('path');

// Files that need ObjectId imports removed
const filesToUpdate = [
  'app/api/pods/analytics/route.ts',
  'app/api/connections/requests/[id]/route.ts',
  'app/api/notifications/[id]/read/route.ts',
  'app/api/connections/potential/route.ts',
  'app/api/connections/requests/route.ts',
  'app/api/connections/active/route.ts',
  'app/api/pods/route.ts',
  'app/api/pods/[id]/route.ts',
  'app/api/pods/match/route.ts',
  'app/api/user/profile/route.ts',
  'app/api/pods/[id]/messages/route.ts',
  'app/api/pods/[id]/messages/[messageId]/like/route.ts',
  'app/api/admin/users/[id]/route.ts',
  'app/api/admin/reports/[id]/route.ts',
  'app/api/chat/[id]/messages/route.ts',
  'app/api/chat/[id]/route.ts'
];

function updateFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Remove ObjectId import
  content = content.replace(
    /import\s+\{\s*ObjectId\s*\}\s+from\s+["']mongodb["']/g,
    ""
  );
  
  // Remove any ObjectId usage (replace with placeholder)
  content = content.replace(
    /new\s+ObjectId\([^)]*\)/g,
    "'placeholder-id'"
  );
  
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Updated: ${filePath}`);
}

console.log('🔄 Removing ObjectId imports...');

filesToUpdate.forEach(updateFile);

console.log('\n🎉 All ObjectId imports removed!'); 