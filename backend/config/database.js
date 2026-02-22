import mongoose from 'mongoose';

// Connection cache for serverless environments (like Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      family: 4,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      console.log(`✅ MongoDB Connected (New Connection): ${mongoose.connection.host}`);
      return mongoose;
    }).catch(error => {
      console.error(`❌ Error connecting to MongoDB: ${error.message}`);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error(`❌ Final Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
