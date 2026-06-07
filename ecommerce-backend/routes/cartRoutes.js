const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware"); // Only logged-in users can manage carts

// --- @desc   Get user's cart ---
// --- @route  GET /api/cart ---
// --- @access Private ---
router.get("/", protect, async (req, res) => {
  try {
    // Find the cart for the logged-in user. Populate product details.
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price imageUrl",
    );

    if (!cart) {
      // If no cart exists, create one for the user
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Server Error fetching cart" });
  }
});

// --- @desc   Add item to cart ---
// --- @route  POST /api/cart/add ---
// --- @access Private ---
router.post("/add", protect, async (req, res) => {
  const { productId, qty } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create cart if it doesn't exist
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].qty += qty;
      // Ensure quantity doesn't exceed stock (basic check)
      if (cart.items[existingItemIndex].qty > product.countInStock) {
        cart.items[existingItemIndex].qty = product.countInStock;
      }
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        name: product.name,
        qty: qty,
        price: product.price,
        image: product.imageUrl,
      });
    }

    // Update cart's updated timestamp
    cart.updatedAt = Date.now();

    const updatedCart = await cart.save();
    // Populate product details for the response
    await updatedCart.populate("items.product", "name price imageUrl");
    res.status(201).json(updatedCart);
  } catch (error) {
    console.error("Add to Cart Error:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }
    res.status(400).json({ message: "Error adding item to cart" });
  }
});

// --- @desc   Remove item from cart ---
// --- @route  DELETE /api/cart/remove/:productId ---
// --- @access Private ---
router.delete("/remove/:productId", protect, async (req, res) => {
  const { productId } = req.params;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the item to be removed
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    if (cart.items.length === initialLength) {
      // Item was not found in the cart
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update cart's updated timestamp
    cart.updatedAt = Date.now();

    const updatedCart = await cart.save();
    // Populate product details for the response
    await updatedCart.populate("items.product", "name price imageUrl");
    res.json(updatedCart);
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }
    res.status(500).json({ message: "Server Error removing item from cart" });
  }
});

// --- @desc   Update item quantity in cart ---
// --- @route  PUT /api/cart/update/:productId ---
// --- @access Private ---
router.put("/update/:productId", protect, async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;

  if (qty === undefined || qty <= 0) {
    return res
      .status(400)
      .json({ message: "Quantity must be a positive number" });
  }

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Check against product stock
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product associated with this cart item not found" });
    }

    if (qty > product.countInStock) {
      return res
        .status(400)
        .json({
          message: `Quantity exceeds available stock (${product.countInStock})`,
        });
    }

    cart.items[itemIndex].qty = qty;
    cart.updatedAt = Date.now();

    const updatedCart = await cart.save();
    await updatedCart.populate("items.product", "name price imageUrl");
    res.json(updatedCart);
  } catch (error) {
    console.error("Update Cart Item Error:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }
    res.status(500).json({ message: "Server Error updating cart item" });
  }
});

module.exports = router;
