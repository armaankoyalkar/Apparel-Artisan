// server.js (updated)
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); // Import auth routes

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json()); // To parse JSON bodies

// Mount Routes
app.use("/api/auth", authRoutes); // Mount auth routes under /api/auth

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce Backend API!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
