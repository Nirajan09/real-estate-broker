const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret";

// Helper function: Send server errors
const handleServerError = (res, error) => {
  console.error(error);
  return res.status(500).json({ message: "Server error" });
};

// Validation Functions
const validateName = (name) => /^[A-Za-z\s]{2,50}$/.test(name);
const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

// REGISTER USER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic presence check
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Field validations
  if (!validateName(name)) {
    return res.status(400).json({
      message:
        "Name must be 2-50 characters and contain only letters and spaces",
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters, with uppercase, lowercase, number, and special character",
    });
  }

  try {
    // Check if user already exists
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) return handleServerError(res, err);
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      db.run(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, "buyer"],
        function (err) {
          if (err) return handleServerError(res, err);

          return res.status(201).json({
            message: "User registered successfully",
            userId: this.lastID,
          });
        }
      );
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// LOGIN USER
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Basic presence check
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Email format validation
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) return handleServerError(res, err);

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (error) {
    handleServerError(res, error);
  }
};