// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware"); // We'll create this middleware next

// --- @desc   Fetch all products ---
// --- @route  GET /api/products ---
// --- @access Public ---
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}); // Find all products
    res.json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Server Error fetching products" });
  }
});

// --- @desc   Fetch single product by ID ---
// --- @route  GET /api/products/:id ---
// --- @access Public ---
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Get Product by ID Error:", error);
    // Handle invalid ObjectId format
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }
    res.status(500).json({ message: "Server Error fetching product" });
  }
});

// --- @desc   Create a product ---
// --- @route  POST /api/products ---
// --- @access Private/Admin ---
router.post("/", protect, admin, async (req, res) => {
  const { name, description, price, countInStock, imageUrl, category, brand } =
    req.body;

  // Validation
  if (!name || !price || !category || !brand) {
    return res
      .status(400)
      .json({
        message:
          "Please provide all required fields (name, price, category, brand)",
      });
  }

  try {
    const product = new Product({
      name,
      description,
      price,
      countInStock,
      imageUrl,
      category,
      brand,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(400).json({ message: "Error creating product" });
  }
});

// --- @desc   Update a product ---
// --- @route  PUT /api/products/:id ---
// --- @access Private/Admin ---
router.put("/:id", protect, admin, async (req, res) => {
  const { name, description, price, countInStock, imageUrl, category, brand } =
    req.body;

  // Validation
  if (!name || !price || !category || !brand) {
    return res
      .status(400)
      .json({
        message:
          "Please provide all required fields (name, price, category, brand)",
      });
  }

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price; // Allow price to be 0
      product.countInStock =
        countInStock !== undefined ? countInStock : product.countInStock; // Allow countInStock to be 0
      product.imageUrl = imageUrl || product.imageUrl;
      product.category = category || product.category;
      product.brand = brand || product.brand;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Update Product Error:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }
    res.status(400).json({ message: "Error updating product" });
  }
});

// --- @desc   Delete a product ---
// --- @route  DELETE /api/products/:id ---
// --- @access Private/Admin ---
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.remove(); // Mongoose v5.x, use deleteOne({ _id: req.params.id }) for v6+
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Delete Product Error:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }
    res.status(500).json({ message: "Server Error deleting product" });
  }
});

module.exports = router;
