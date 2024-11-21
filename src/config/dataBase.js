const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.DB);
};

connectDB().then(data => {
  console.log('Database is Connected');
});

connectDB().catch(err => {
  console.log(err.message, 'Databse is not connected');
});
