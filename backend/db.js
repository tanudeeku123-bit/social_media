// MongoDB connection using Mongoose.
// Fallback to in-memory MongoDB server if no valid MONGODB_URI is provided.
const mongoose = require('mongoose');

let dbPromise = null;

async function connectDB() {
  let uri = process.env.MONGODB_URI;

  // Fallback if uri is missing, generic, or the default placeholder
  if (!uri || uri.includes('placeholder') || uri.includes('cluster.mongodb.net') || uri.includes('user:password')) {
    console.log('No valid MONGODB_URI found. Starting in-memory MongoDB server...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create({
        binary: {
          version: '4.2.24'
        }
      });
      uri = mongoServer.getUri();
      console.log(`In-memory MongoDB started at: ${uri}`);
    } catch (err) {
      console.error('Failed to start in-memory MongoDB:', err.message);
      process.exit(1);
    }
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

dbPromise = connectDB();

module.exports = { mongoose, dbPromise };
