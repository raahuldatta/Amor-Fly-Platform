const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amor_fly_db';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secure_jwt_secret_at_least_32_chars_long_please_change_this';
const NODE_ENV = process.env.NODE_ENV || 'development';

async function setupDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('amor_fly_db');

    // Create collections
    const collections = ['users', 'pods', 'messages', 'connections', 'notifications'];
    for (const collection of collections) {
      try {
        await db.createCollection(collection);
        console.log(`Created collection: ${collection}`);
      } catch (error) {
        if (error.code === 48) { // Collection already exists
          console.log(`Collection already exists: ${collection}`);
        } else {
          throw error;
        }
      }
    }

    // Create indexes for users collection
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ anonymousName: 1 });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ isActive: 1 });

    // Create indexes for pods collection
    await db.collection('pods').createIndex({ name: 1 });
    await db.collection('pods').createIndex({ creatorId: 1 });
    await db.collection('pods').createIndex({ members: 1 });
    await db.collection('pods').createIndex({ tags: 1 });
    await db.collection('pods').createIndex({ isActive: 1 });

    // Create indexes for messages collection
    await db.collection('messages').createIndex({ podId: 1, createdAt: 1 });
    await db.collection('messages').createIndex({ senderId: 1 });
    await db.collection('messages').createIndex({ type: 1 });

    // Create indexes for connections collection
    await db.collection('connections').createIndex({ requesterId: 1, recipientId: 1 }, { unique: true });
    await db.collection('connections').createIndex({ recipientId: 1, requesterId: 1 });
    await db.collection('connections').createIndex({ status: 1 });

    // Create indexes for notifications collection
    await db.collection('notifications').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('notifications').createIndex({ isRead: 1 });
    await db.collection('notifications').createIndex({ type: 1 });

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

setupDatabase();
