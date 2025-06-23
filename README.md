# Amor Fly Platform

A social learning platform that connects people through shared skills and interests, fostering collaborative learning experiences.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Vercel account (for deployment)

### 1. **Clone and Install**
```bash
git clone <your-repo-url>
cd amor-fly-platform
npm install
```

### 2. **Set up Environment Variables**
Create a `.env.local` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/amor_fly_db?retryWrites=true&w=majority&ssl=true&tls=true&tlsAllowInvalidCertificates=false
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
NODE_ENV=development
```

### 3. **Set up Database**
```bash
# Run the deployment setup script
npm run deploy-setup
```

### 4. **Start Development Server**
```bash
npm run dev
```

## 🗄️ Database Schema

### Collections

**Users**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  profile: {
    bio: String,
    avatar: String,
    skills: [String],
    location: String,
    interests: [String]
  },
  selectedSkills: [String],
  personalityAnswers: Object,
  anonymousName: String,
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean,
  isVerified: Boolean,
  role: String, // "user" or "admin"
  podId: ObjectId (optional),
  growthPoints: Number,
  engagementLevel: Number,
  weeklyConnectionsUsed: Number
}
```

**Pods (Learning Groups)**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  creatorId: ObjectId (ref: users),
  members: [ObjectId], // ref: users
  maxMembers: Number,
  category: String,
  tags: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Messages**
```javascript
{
  _id: ObjectId,
  podId: ObjectId (ref: pods),
  senderId: ObjectId (ref: users),
  content: String,
  type: String, // "text", "image", "file"
  attachments: [String], // URLs
  likes: [ObjectId], // ref: users
  createdAt: Date,
  updatedAt: Date
}
```

**Connections**
```javascript
{
  _id: ObjectId,
  requesterId: ObjectId (ref: users),
  recipientId: ObjectId (ref: users),
  status: String, // "pending", "accepted", "rejected"
  createdAt: Date,
  updatedAt: Date
}
```

**Notifications**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  type: String, // "connection_request", "pod_invite", "message", etc.
  title: String,
  message: String,
  data: Object, // additional data
  isRead: Boolean,
  createdAt: Date
}
```

## 🚀 Deployment to Vercel

### 1. **Prepare Your MongoDB Atlas**
- Create a MongoDB Atlas cluster
- Create a database named `amor_fly_db`
- Get your connection string

### 2. **Update Connection String**
Your MongoDB connection string should include:
- Database name: `amor_fly_db`
- SSL parameters for Vercel compatibility

**Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/amor_fly_db?retryWrites=true&w=majority&ssl=true&tls=true&tlsAllowInvalidCertificates=false
```

### 3. **Set Environment Variables in Vercel**
Go to your Vercel project → Settings → Environment Variables:

- **MONGODB_URI**: Your full connection string
- **JWT_SECRET**: A long, random string (generate with `openssl rand -base64 32`)

### 4. **Deploy**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 5. **Test Your Deployment**
- Visit your deployed site
- Try to sign up for a new account
- Test login functionality

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run setup        # Set up database locally
npm run deploy-setup # Set up database for deployment
npm run seed         # Seed database with sample data
```

## 🛠️ Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
- Ensure your connection string includes the database name: `amor_fly_db`
- Add SSL parameters: `&ssl=true&tls=true&tlsAllowInvalidCertificates=false`
- Check that your MongoDB Atlas cluster is running

**2. Build Errors**
- Ensure all environment variables are set in Vercel
- Check that `MONGODB_URI` and `JWT_SECRET` are properly configured

**3. Login/Signup Issues**
- Check Vercel runtime logs for detailed error messages
- Ensure the database collections are created properly

### Getting Help
- Check the Vercel deployment logs
- Review the MongoDB Atlas cluster status
- Ensure all environment variables are set correctly

## 📝 License

This project is licensed under the MIT License.
