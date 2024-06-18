// backend/database.js

const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://sellerscore:faI71QgPIDBp8ikf@sellerscore.ayomdwm.mongodb.net/mydatabase'; // Replace 'mydatabase' with your actual database name

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
