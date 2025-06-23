const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/amor_fly_db"

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("amor_fly_db")

    // Clear existing data
    await db.collection("users").deleteMany({})
    await db.collection("pods").deleteMany({})
    await db.collection("messages").deleteMany({})
    await db.collection("notifications").deleteMany({})

    console.log("Database cleared")

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("messages").createIndex({ podId: 1, createdAt: 1 })
    await db.collection("pods").createIndex({ tags: 1 })
    await db.collection("notifications").createIndex({ userId: 1, createdAt: -1 })

    console.log("Indexes created")

    // Create sample admin user
    const bcrypt = require("bcryptjs")
    const hashedPassword = await bcrypt.hash("admin123", 12)

    const adminUser = {
      email: "admin@amorfly.com",
      password: hashedPassword,
      name: "Admin User",
      profile: {
        bio: "System Administrator",
        avatar: "",
        skills: ["Leadership", "Management"],
        location: "",
        interests: ["Technology", "Education"]
      },
      selectedSkills: ["Leadership", "Management"],
      personalityAnswers: {
        learning_style: "visual",
        motivation: "achievement",
        pace: "steady",
        interaction: "leader",
      },
      anonymousName: "AdminUser1",
      growthPoints: 1000,
      engagementLevel: 100,
      weeklyConnectionsUsed: 0,
      isActive: true,
      isVerified: true,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActive: new Date(),
    }

    await db.collection("users").insertOne(adminUser)
    console.log("Admin user created: admin@amorfly.com / admin123")

    // Create sample regular user
    const regularUser = {
      email: "user@amorfly.com",
      password: hashedPassword,
      name: "Regular User",
      profile: {
        bio: "Learning enthusiast",
        avatar: "",
        skills: ["Guitar", "Cooking"],
        location: "",
        interests: ["Music", "Food"]
      },
      selectedSkills: ["Guitar", "Cooking"],
      personalityAnswers: {
        learning_style: "kinesthetic",
        motivation: "social",
        pace: "moderate",
        interaction: "collaborator",
      },
      anonymousName: "CuriousLearner123",
      growthPoints: 50,
      engagementLevel: 75,
      weeklyConnectionsUsed: 0,
      isActive: true,
      isVerified: true,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActive: new Date(),
    }

    await db.collection("users").insertOne(regularUser)
    console.log("Regular user created: user@amorfly.com / admin123")

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Seeding error:", error)
  } finally {
    await client.close()
  }
}

if (require.main === module) {
  seedDatabase()
}

module.exports = { seedDatabase }
