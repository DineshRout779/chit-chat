const { default: mongoose } = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log('Database connected');
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
