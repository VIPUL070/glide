import mongoose from "mongoose";

const URI = process.env.DB_URL;

if (!URI) {
  throw new Error("Please define the DB_URL environment variable inside .env.local");
}

let cached = global.glideConn;

if (!cached) {
  cached = global.glideConn = { conn: null, promise: null };
}

const connectDB = async ()=> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(URI, opts).then((m) => m.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }

  return cached.conn;
};

export default connectDB;