import mongoose from 'mongoose';

export const initDB = async () => {
  try {
    const connectionString = process.env.MONGO_URI;
    if (!connectionString) {
      throw new Error('MONGODB_URL is not defined in environment variables');
    }

    await mongoose.connect(connectionString, {
      user: process.env.DB_USER,
      pass: process.env.DB_PASSWORD,
      dbName: process.env.DB_NAME,
    });

    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    throw error;
  }
};