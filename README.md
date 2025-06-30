# 🌐 Amor Fly Platform

**Amor Fly** is a modern **social learning platform** that connects people through shared skills, interests, and collaborative learning groups called **Pods**. Built using **Node.js 18+, Supabase, Clerk, and Vercel**, it empowers peer-to-peer learning with personalized experiences and real-time collaboration.

---

## 🚀 Quick Start

### ✅ Prerequisites

Make sure you have the following installed and set up:

- **Node.js** 18 or later
- **Supabase** account (for database and backend services)
- **Clerk** account (for authentication)
- **Vercel** account (for deployment)

---

### 📦 1. Clone & Install

```bash
git clone <your-repo-url>
cd amor-fly-platform
npm install
```

---

### ⚙️ 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
NODE_ENV=development
```

You can find these values in your Supabase project under **Project Settings → API**.

---

### 🧩 3. Set Up Supabase Database

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Create a new project and database
3. Use SQL Editor to create your schema (tables like `users`, `pods`, `messages`, etc.)
4. Enable **Row Level Security (RLS)** and write appropriate policies
5. Optionally, seed test data with Supabase SQL Editor or REST API

---

### 💻 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🗄️ Database Schema Overview

### 📍 Users (via Supabase)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  bio TEXT,
  avatar TEXT,
  skills TEXT[],
  location TEXT,
  interests TEXT[],
  selected_skills TEXT[],
  personality_answers JSONB,
  anonymous_name TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'user',
  pod_id UUID,
  growth_points INTEGER DEFAULT 0,
  engagement_level INTEGER DEFAULT 0,
  weekly_connections_used INTEGER DEFAULT 0
);
```

### 👥 Pods

```sql
CREATE TABLE pods (
  id UUID PRIMARY KEY,
  name TEXT,
  description TEXT,
  creator_id UUID REFERENCES users(id),
  members UUID[],
  max_members INTEGER,
  category TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 💬 Messages

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  pod_id UUID REFERENCES pods(id),
  sender_id UUID REFERENCES users(id),
  content TEXT,
  type TEXT,
  attachments TEXT[],
  likes UUID[],
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 🤝 Connections

```sql
CREATE TABLE connections (
  id UUID PRIMARY KEY,
  requester_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  status TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 🔔 Notifications

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type TEXT,
  title TEXT,
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## 🧪 Development Scripts

| Command              | Description                                  |
|----------------------|----------------------------------------------|
| `npm run dev`        | Start development server                     |
| `npm run build`      | Build the app for production                 |
| `npm run start`      | Start the production server                  |
| `npm run lint`       | Run ESLint                                   |
| `npm run seed`       | (Optional) Seed Supabase DB via API/script   |

---

## 🚀 Deployment on Vercel

### 1. Configure Environment Variables in Vercel

Go to **Vercel → Project Settings → Environment Variables** and add:

| Key                         | Value                                                    |
|----------------------------|----------------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL                                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your project's anonymous public API key          |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (for server-side use only)              |
| `JWT_SECRET`               | A strong random string (e.g., via `openssl rand -base64 32`) |

---

### 2. Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

Visit the generated URL to access your live app.

---

## 🛠️ Troubleshooting

### 🔐 Auth Issues (Clerk)
- Ensure Clerk frontend and backend integrations are configured properly
- Make sure `JWT_SECRET` matches across environments

### 🧪 Supabase Errors
- Confirm correct `anon` and `service_role` keys
- Use Supabase logs and SQL editor to debug
- Review RLS policies if data isn’t returning

### ⚙️ Build/Deploy Issues
- Check Vercel logs for runtime errors
- Ensure all env variables are properly set in both local and prod

---

## ✨ Why Amor Fly?

- 🌱 Grow through collaborative learning pods
- 🔐 Clerk + Supabase = secure and scalable user auth + DB
- 💬 Real-time messaging and engagement features
- 🚀 Fully deployable with just one command

---

## 📜 License

This project is licensed under the **MIT License**.
