// Create sample notifications for testing
const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/amor-fly"

async function createSampleNotifications() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("amor-fly")

    // Get a sample user
    const user = await db.collection("users").findOne({})
    if (!user) {
      console.log("No users found. Please create a user first.")
      return
    }

    const sampleNotifications = [
      {
        userId: user._id.toString(),
        type: "connection",
        title: "New Connection Request",
        message: "CuriousLearner123 wants to connect with you!",
        actionUrl: "/connections",
        isRead: false,
        createdAt: new Date(),
      },
      {
        userId: user._id.toString(),
        type: "pod",
        title: "Pod Activity",
        message: "Your Guitar Flight Pod has 3 new messages",
        actionUrl: "/pod/guitar-pod-1",
        isRead: false,
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        userId: user._id.toString(),
        type: "system",
        title: "Weekly Progress",
        message: "You've earned 25 Growth Points this week!",
        actionUrl: "/dashboard",
        isRead: true,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
      },
    ]

    await db.collection("notifications").insertMany(sampleNotifications)
    console.log("Sample notifications created successfully")
  } catch (error) {
    console.error("Error creating sample notifications:", error)
  } finally {
    await client.close()
  }
}

if (require.main === module) {
  createSampleNotifications()
}

module.exports = { createSampleNotifications }
