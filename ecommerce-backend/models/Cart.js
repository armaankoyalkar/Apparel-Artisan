// models/Cart.js
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to the Product model
    required: true,
  },
  name: {
    // Denormalized for easier access, should match product name
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    // Denormalized for easier access, should match product price at time of addition
    type: Number,
    required: true,
  },
  image: {
    // Denormalized for easier access
    type: String,
    required: false,
  },
  // Optional additional fields for customization
  // size: { type: String }, // Example of custom field
  // color: { type: String }, // Example of custom field
});

// Cart schema for the user's cart
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
    unique: true, // Each user has only one cart
    index: true, // Add an index for quicker lookups
  },
  items: [cartItemSchema], // Array of cart items
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update 'updatedAt' field whenever the cart is updated
cartSchema.pre("save", function (next) {
  if (this.isModified("items")) {
    this.updatedAt = Date.now(); // Update 'updatedAt' when cart items change
  }
  next();
});

// Optional: Pre-remove hook to clean up cart when user is deleted
cartSchema.pre("remove", async function (next) {
  await this.model("Product").deleteMany({
    _id: { $in: this.items.map((item) => item.product) },
  });
  next();
});

// Create Cart model
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
