const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log('Database is Connected');
  } catch (err) {
    console.error(err.message, 'Database is not connected');
    process.exit(1); // Exit process with failure
  }
};

connectDB();
