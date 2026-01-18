const mongoose = require("mongoose");

const connectDb = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("Error: MONGO_URI is undefined. Check your .env file");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri); // no options needed in v7+
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDb;