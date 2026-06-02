// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide product description"],
  },
  price: {
    type: Number,
    required: [true, "Please provide product price"],
    min: 0,
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  imageUrl: {
    type: String,
    required: false, // Optional for now, can be added later
    match: [
      /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg)$/i,
      "Please provide a valid image URL",
    ], // Basic URL validation
  },
  category: {
    type: String,
    required: [true, "Please provide product category"],
    trim: true,
    index: true, // Adding an index for search optimization
  },
  brand: {
    type: String,
    required: [true, "Please provide product brand"],
    trim: true,
    index: true, // Adding an index for search optimization
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Product model using the schema
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
