// const mongoose = require('mongoose');
// require('dotenv').config();
// console.log('first', process.env.DB);
// const connectDB = async () => {
//   await mongoose.connect(process.env.DB);
// };

// connectDB().then(data => {
//   console.log('Database is Connected');
// });

// connectDB().catch(err => {
//   console.log(err.message, 'Databse is not connected');
// });

const mongoose = require('mongoose');
require('dotenv').config(); // Ensure .env is loaded

const connectDB = async () => {
  try {
    if (!process.env.DB) {
      throw new Error(
        'Database URI is not defined in the environment variables',
      );
    }
    await mongoose.connect(process.env.DB);
    console.log('Database is connected');
  } catch (err) {
    console.log(err.message, 'Database is not connected');
  }
};

connectDB();
