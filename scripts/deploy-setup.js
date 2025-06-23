const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amor_fly_db';

async function deploySetup() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB for deployment setup');

    const db = client.db('amor_fly_db');

    // Create collections if they don't exist
    const collections = ['users', 'pods', 'messages', 'connections', 'notifications'];
    for (const collection of collections) {
      try {
        await db.createCollection(collection);
        console.log(`✓ Created collection: ${collection}`);
      } catch (error) {
        if (error.code === 48) { // Collection already exists
          console.log(`✓ Collection already exists: ${collection}`);
        } else {
          console.error(`✗ Error creating collection ${collection}:`, error.message);
        }
      }
    }

    // Create indexes
    console.log('\nCreating indexes...');
    
    // Users indexes
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('✓ Users email index created');
    } catch (error) {
      console.log('✓ Users email index already exists');
    }

    try {
      await db.collection('users').createIndex({ anonymousName: 1 });
      console.log('✓ Users anonymousName index created');
    } catch (error) {
      console.log('✓ Users anonymousName index already exists');
    }

    try {
      await db.collection('users').createIndex({ role: 1 });
      console.log('✓ Users role index created');
    } catch (error) {
      console.log('✓ Users role index already exists');
    }

    // Pods indexes
    try {
      await db.collection('pods').createIndex({ name: 1 });
      console.log('✓ Pods name index created');
    } catch (error) {
      console.log('✓ Pods name index already exists');
    }

    try {
      await db.collection('pods').createIndex({ tags: 1 });
      console.log('✓ Pods tags index created');
    } catch (error) {
      console.log('✓ Pods tags index already exists');
    }

    // Messages indexes
    try {
      await db.collection('messages').createIndex({ podId: 1, createdAt: 1 });
      console.log('✓ Messages podId + createdAt index created');
    } catch (error) {
      console.log('✓ Messages podId + createdAt index already exists');
    }

    // Connections indexes
    try {
      await db.collection('connections').createIndex({ requesterId: 1, recipientId: 1 }, { unique: true });
      console.log('✓ Connections requesterId + recipientId index created');
    } catch (error) {
      console.log('✓ Connections requesterId + recipientId index already exists');
    }

    try {
      await db.collection('connections').createIndex({ status: 1 });
      console.log('✓ Connections status index created');
    } catch (error) {
      console.log('✓ Connections status index already exists');
    }

    // Notifications indexes
    try {
      await db.collection('notifications').createIndex({ userId: 1, createdAt: -1 });
      console.log('✓ Notifications userId + createdAt index created');
    } catch (error) {
      console.log('✓ Notifications userId + createdAt index already exists');
    }

    console.log('\n🎉 Deployment setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update your MONGODB_URI in Vercel to include the database name:');
    console.log('   mongodb+srv://username:password@cluster.mongodb.net/amor_fly_db?retryWrites=true&w=majority&ssl=true&tls=true&tlsAllowInvalidCertificates=false');
    console.log('2. Deploy your project to Vercel');
    console.log('3. Test signup/login functionality');

  } catch (error) {
    console.error('❌ Deployment setup failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

deploySetup(); 