require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes"); // Import cart routes
const orderRoutes = require("./routes/orderRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }),
);
app.use(express.json()); // To parse JSON bodies

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes); // Mount cart routes under /api/cart
app.use("/api/orders", orderRoutes);
// Basic route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce Backend API!");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "An unexpected server error occurred" });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start the API. Check your environment configuration.");
    process.exit(1);
  }
};

startServer();
