# Amor Fly Platform: Project Overview

## 🚀 Introduction

**Amor Fly** is a skill-based, community-driven platform designed to foster authentic connections and collaborative learning. The core idea is to group users into anonymous "Flight Pods" based on their skills and goals, enabling them to learn, grow, and connect in a supportive environment.

## 🏗️ Technical Stack

- **Frontend & Backend:** Next.js (App Router, React 19)
- **Database:** MongoDB Atlas (cloud-hosted)
- **Authentication:** Custom JWT-based system (no NextAuth)
- **UI/UX:** Tailwind CSS, Radix UI, Lucide Icons, custom dark/violet theme
- **Deployment:** Vercel (fully serverless, scalable)
- **State Management:** React Context for Auth, React hooks for local state
- **API:** RESTful endpoints under `/api/`

## 🧩 Key Features Developed

### 1. Authentication & User Management
- **Sign Up & Login:** Users can register and log in using email and password.
- **JWT Auth:** Secure, stateless authentication using JWT tokens stored in cookies.
- **Anonymous Identity:** Users are assigned an anonymous name for privacy within pods.
- **Profile API:** Users can fetch their profile and stats securely.

### 2. Homepage & Navigation
- **Modern Landing Page:** Hero section, feature highlights, and clear CTAs.
- **Header Navigation:** Links to About, How It Works, Skills, Contact, Login, and Sign Up.
- **Responsive Design:** Works on all devices.

### 3. Pod System
- **Pod Formation:** Users are matched into "Flight Pods" based on skills and goals.
- **Pod Chat:** Real-time group chat interface for pod members (UI ready, backend can be extended for sockets).
- **Pod Analytics:** Each pod has an analytics dashboard showing engagement, growth, and activity.

### 4. Skills Management
- **Skill Selection:** Users can add, view, and remove skills from their profile.
- **SkillManager Component:** UI for managing user skills, integrated with the backend.

### 5. Dashboard
- **Personalized Dashboard:** Shows user stats, pod info, skills, and quick links to settings/notifications.
- **Dark Violet Theme:** Consistent, modern, and accessible UI.

### 6. Notifications & Settings
- **Notifications Page:** Tabbed interface for all, unread, pod, connection, and achievement notifications.
- **Settings Page:** Manage account, notification preferences, privacy, and appearance.

### 7. Other Pages
- **About, How It Works, Skills, Contact:** Informational pages to guide and engage users.

### 8. Admin & Analytics
- **Pod Analytics API:** Endpoints and UI for viewing pod activity, member engagement, and growth.
- **Admin APIs:** (Scaffolded) for managing reports, users, and pods.

### 9. Sample Button Previews
- **Check Matching Status:** A button that allows users to view their current pod matching status and pending matches.
- **Discover Compatible Learners:** A button that opens a modal or page showing users with similar skills and goals.
- **Join Community:** A button that redirects users to the community page or prompts them to join a pod.
- **Add Skill:** A button that opens a form or modal for users to add new skills to their profile.

## 🔒 Security & Best Practices

- **Environment Variables:** All secrets (MongoDB URI, JWT secret) are stored in `.env.local` and not committed to git.
- **Connection Pooling:** MongoDB connection is optimized for serverless environments.
- **Error Handling:** Robust error handling in all API routes and database operations.
- **Input Validation:** Zod is used for validating user input on signup and skill management.

## ⚙️ How It Works (User Flow)

1. **Landing:** User visits the homepage, learns about the platform, and clicks "Get Started."
2. **Sign Up:** User registers, selects skills, and is assigned an anonymous name.
3. **Pod Matching:** User is placed in a pod with others sharing similar skills/goals.
4. **Dashboard:** User sees their stats, pod info, and can manage skills.
5. **Pod Chat:** User interacts with pod members via group chat.
6. **Progress & Analytics:** User tracks growth points, engagement, and pod activity.
7. **Notifications & Settings:** User receives updates and can customize preferences.

## 🛠️ Deployment & DevOps

- **Vercel:** One-click deployment, environment variables managed via dashboard.
- **MongoDB Atlas:** Cloud database, IP whitelisting for security.
- **Automated Build:** Next.js config optimized for serverless deployment.
- **Monitoring:** Connection pool stats and error logs for debugging.

## 📝 What's Ready & What Can Be Extended

**Ready:**
- Full authentication flow
- Pod creation, analytics, and chat UI
- Skill management
- Dashboard, notifications, and settings
- Theming and responsive design

**Can Be Extended:**
- Real-time chat (Socket.io integration)
- Peer feedback and progress tracking
- Admin dashboard for moderation
- More advanced analytics and gamification

## 📂 How to Run Locally

1. Clone the repo and install dependencies:
   ```sh
   pnpm install
   ```
2. Create `.env.local` with your MongoDB URI and JWT secret.
3. Start the dev server:
   ```sh
   pnpm dev
   ```
4. Visit `http://localhost:3000`

## 🌐 How to Deploy

- Push to GitHub and connect to Vercel.
- Set environment variables in Vercel dashboard.
- Deploy and monitor via Vercel's UI.

---

**If you want a diagram, code walkthrough, or have questions about any part, just ask!** 