// backend/database.js

const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/myLocalDB';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
  
      useCreateIndex: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
