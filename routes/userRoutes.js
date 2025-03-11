// Import modules
const express = require("express");
const { createUser } = require("../controllers/userController");

const router = express.Router();    // Create a new Express Router instance

/**
 * Route to create new user
 */
router.post("/users", createUser);

// Output sucessful loading to console
console.log("userRoutes Loaded Successfully!");

module.exports = router;