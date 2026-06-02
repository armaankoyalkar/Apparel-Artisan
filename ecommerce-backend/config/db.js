// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Options to avoid deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex is deprecated, use index: true in schema definition instead
      // useFindAndModify: false is deprecated, use findOneAndUpdate/deleteOne etc. directly
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
