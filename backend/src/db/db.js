const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT, {
      maxPoolSize: 10, 
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB Connected with Pooling");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;