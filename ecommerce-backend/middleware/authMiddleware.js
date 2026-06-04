// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// --- Protect Middleware ---
const protect = async (req, res, next) => {
  let token;

  // Check if there is a token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get the user from the token (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Token Verification Error:", error);
      // Check if the error is due to an expired token
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token expired, please log in again" });
      }
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token is provided
  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }
};

// --- Admin Middleware ---
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Proceed to the next middleware or route handler
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { protect, admin };
