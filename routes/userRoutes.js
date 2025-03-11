// Import modules
const express = require("express");
const { createUser, getUserByEmail } = require("../controllers/userController");

const router = express.Router();    // Create a new Express Router instance

/**
 * Route to create new user
 */
router.post("/users", createUser);

/**
 * Route to get user by email search
 */
router.post("/users", getUserByEmail);

// Output sucessful loading to console
console.log("userRoutes Loaded Successfully!");

module.exports = router;