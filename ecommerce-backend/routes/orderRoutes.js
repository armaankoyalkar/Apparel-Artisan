const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ message: "Server Error fetching orders" });
  }
});
router.post("/", protect, async (req, res) => {
  const shippingAddress = req.body.shippingAddress || {};
  const requiredFields = ["street", "city", "state", "zipCode", "country"];
  if (requiredFields.some((field) => !shippingAddress[field]?.trim())) {
    return res.status(400).json({ message: "Please provide a complete shipping address" });
  }
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }
    const orderItems = [];
    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product);
      if (!product || product.countInStock < cartItem.qty) {
        return res.status(400).json({ message: `${cartItem.name} is no longer available in the requested quantity` });
      }
      product.countInStock -= cartItem.qty;
      await product.save();
      orderItems.push({
        product: product._id,
        name: product.name,
        qty: cartItem.qty,
        price: product.price,
        image: product.imageUrl || "",
      });
    }
    const totalAmount = orderItems.reduce((total, item) => total + item.price * item.qty, 0);
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });
    cart.items = [];
    await cart.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server Error creating order" });
  }
});
module.exports = router;
