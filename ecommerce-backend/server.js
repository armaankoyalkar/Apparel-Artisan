require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes"); // Import cart routes
const orderRoutes = require("./routes/orderRoutes");
const app = express();
const PORT = process.env.PORT || 5000;
const dns = require("dns");
// In case of a MongoDB Atlas connection, set custom DNS servers to avoid potential DNS resolution issues.
if (process.env.MONGODB_URI?.startsWith("mongodb+srv://")) {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}
 
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
 
// Serve the built React frontend (present when built via the combined
// Dockerfile, which copies the frontend build into ./public). Running the
// backend alone in local dev without that folder is fine too — the static
// middleware and fallback below simply won't find anything to serve.
const frontendBuildPath = path.join(__dirname, "public");
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
 
  // Anything that isn't an API route falls back to index.html so React
  // Router can handle client-side routes like /products/123.
  app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendBuildPath, "index.html"), (err) => {
      if (err) next();
    });
  });
} else {
  app.get("/", (req, res) => {
    res.send("Welcome to the E-commerce Backend API!");
  });
}
 
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