// server.js (updated)
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db"); // Import the database connection function

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json()); // To parse JSON bodies

// Routes (will be added later)
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce Backend API!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
