require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes"); // Import product routes

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json()); // To parse JSON bodies

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes); // Mount product routes under /api/products

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce Backend API!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Use backticks here for interpolation
});
const createdProduct = await product.save();
