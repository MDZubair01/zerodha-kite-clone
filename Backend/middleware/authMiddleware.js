// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.TOKEN_KEY || "zerodha_clone_secret_key_123";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Contains { id: user._id }
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = verifyToken;