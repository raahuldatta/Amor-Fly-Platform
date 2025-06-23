-- MongoDB Collections Schema (for reference)
-- This would be implemented in MongoDB, not SQL

-- Users Collection
{
  "_id": "ObjectId",
  "email": "string",
  "password": "string (hashed)",
  "selectedSkills": ["string"],
  "personalityAnswers": {
    "learning_style": "string",
    "motivation": "string", 
    "pace": "string",
    "interaction": "string"
  },
  "anonymousName": "string",
  "growthPoints": "number",
  "engagementLevel": "number", 
  "weeklyConnectionsUsed": "number",
  "podId": "string",
  "isActive": "boolean",
  "createdAt": "Date"
}

-- Pods Collection
{
  "_id": "ObjectId",
  "name": "string",
  "skill": "string",
  "members": ["string"], -- Array of user IDs
  "weeklyGoal": "string",
  "isActive": "boolean",
  "createdAt": "Date"
}

-- Messages Collection  
{
  "_id": "ObjectId",
  "podId": "string",
  "senderId": "string", 
  "content": "string",
  "type": "string", -- 'text', 'progress', 'resource'
  "timestamp": "Date",
  "likes": "number",
  "resourceUrl": "string",
  "progressData": {
    "skill": "string",
    "description": "string",
    "imageUrl": "string"
  }
}

-- Connections Collection
{
  "_id": "ObjectId", 
  "user1Id": "string",
  "user2Id": "string",
  "status": "string", -- 'pending', 'accepted', 'declined'
  "createdAt": "Date",
  "weekNumber": "number"
}

-- Progress Tracking Collection
{
  "_id": "ObjectId",
  "userId": "string",
  "skill": "string", 
  "progressEntries": [{
    "date": "Date",
    "description": "string",
    "pointsEarned": "number",
    "peerFeedback": [{
      "fromUserId": "string",
      "rating": "number",
      "comment": "string"
    }]
  }]
}
