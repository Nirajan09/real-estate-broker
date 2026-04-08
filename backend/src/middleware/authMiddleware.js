const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// JWT Authentication Middleware
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header exists
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Expect header format: "Bearer <token>"
  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  const token = tokenParts[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach decoded user info to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};