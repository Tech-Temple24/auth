const express = require("express");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");

// // Load environment variables
// dotenv.config();


// Check if environment variables are loaded
// console.log("MONGO_URI:", process.env.MONGO_URL);
// console.log("JWT_SECRET:", process.env.JWT_SECRET);


// Initialize express app
const app = express();

// app.use(bodyParser.json());

// // Connect to the database
// require("./db");

// Import routes
// const authRoutes = require("./routes/auth");

// // Use routes
// app.use("/api/auth", authRoutes); // Make sure authRoutes is a function, not an object

// Define the root route
app.get("/", (req, res) => {
  res.send("Welcome");
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
