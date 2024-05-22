const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authmiddle = require("../middleware/authmiddle");
const allowRoles = require("../middleware/roles");

const router = express.Router();

// Route for user signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashPassword,
      role: "student",
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});

// Route for user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Compare the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid password");
    }

    // Generate JWT
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).send({ message: "Login successful", token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Login failed");
  }
});

// Route to promote a student to instructor
router.put(
  "/promote/:id",
  authmiddle,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role: "instructor" },
        { new: true }
      );
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.status(200).send("User promoted to instructor");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Failed to promote user");
    }
  }
);

// Route to delete a user
router.delete(
  "/user/:id",
  authmiddle,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.status(200).send("User deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Failed to delete user");
    }
  }
);

// Protected route example
router.get("/protected", authmiddle, (req, res) => {
  res.send("This is a protected route");
});

router.get("/pro", authmiddle, (req, res) => {
  res.send("This is a protected route 2");
});

router.get("/me", authmiddle, (req, res) => {
  res.send(req.user);
});


module.exports = router;
