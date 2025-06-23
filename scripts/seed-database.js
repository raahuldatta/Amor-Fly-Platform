// MongoDB Seed Script
const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/amor-fly"

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("amor-fly")

    // Clear existing data
    await db.collection("users").deleteMany({})
    await db.collection("pods").deleteMany({})
    await db.collection("messages").deleteMany({})

    console.log("Database cleared")

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("messages").createIndex({ podId: 1, timestamp: 1 })
    await db.collection("pods").createIndex({ skill: 1 })

    console.log("Indexes created")

    // Seed sample skills
    const sampleSkills = [
      "Guitar",
      "Piano",
      "Singing",
      "Drawing",
      "Painting",
      "Photography",
      "Cooking",
      "Baking",
      "Gardening",
      "Yoga",
      "Meditation",
      "Mindfulness",
      "Running",
      "Swimming",
      "Dancing",
      "Writing",
      "Reading",
      "Language Learning",
      "Programming",
      "Web Design",
      "Digital Marketing",
      "Public Speaking",
      "Leadership",
      "Time Management",
      "Financial Literacy",
      "Entrepreneurship",
    ]

    // Create sample anonymous names
    const adjectives = ["Curious", "Eager", "Focused", "Creative", "Dedicated", "Inspired", "Motivated", "Passionate"]

    const nouns = ["Learner", "Explorer", "Seeker", "Student", "Dreamer", "Builder", "Creator", "Thinker"]

    function generateAnonymousName() {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
      const noun = nouns[Math.floor(Math.random() * nouns.length)]
      const num = Math.floor(Math.random() * 999) + 1
      return `${adj}${noun}${num}`
    }

    console.log("Database seeded successfully")
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
