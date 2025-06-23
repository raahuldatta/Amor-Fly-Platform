#!/bin/bash

# Add environment variables to Vercel
echo "Adding environment variables to Vercel..."

# Clerk Keys
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production <<< "pk_test_ZGl2ZXJzZS15YWstMjEuY2xlcmsuYWNjb3VudHMuZGV2JA"
vercel env add CLERK_SECRET_KEY production <<< "sk_test_7geVdf61hXCAsy7jSSWAqOLVi9gLX9izWd3q2C2Xcw"
vercel env add CLERK_WEBHOOK_SECRET production <<< "whsec_HC4oBV7+sVjGkPs/TQSocQFICn8fYks5"

# Supabase Configuration
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://pdspkeftywvnbffhtocu.supabase.co"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkc3BrZWZ0eXd2bmJmZmh0b2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODk5OTEsImV4cCI6MjA2NjA2NTk5MX0.PzOBCV4htkpB70cH8EZZ4z6DeohtfF573AjKdGMrjB8"
vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkc3BrZWZ0eXd2bmJmZmh0b2N1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQ4OTk5MSwiZXhwIjoyMDY2MDY1OTkxfQ.ad1Ffv6D50W0HUGvYQ5AStOdd3rPHiFmadN6bohrWYg"

# MongoDB (for backward compatibility)
vercel env add MONGODB_URI production <<< "mongodb+srv://ArkhamKnight:rh7NWFdlmitkgHK3@amor-fly.4wq98ng.mongodb.net/amor_fly_db?retryWrites=true&w=majority&ssl=true&tls=true&tlsAllowInvalidCertificates=false"

echo "Environment variables added successfully!" 