// Import required modules
const express = require("express");  // Express framework for handling routes
const { createUser, getUserByEmail, authenticateUser } = require("../controllers/userController"); // Import user controller functions

// Create a new Express Router instance
const router = express.Router();

/**
 * @route   POST /api/users/createUser
 * @desc    Create a new user and store their details in the database
 * @access  Public (Authentication to be added later)
 *
 * This route handles user registration by accepting user details in the request body,
 * validating the input, hashing the password, and storing the record in the database.
 */
router.post("/createUser", createUser);

/**
 * @route   POST /api/users/getUserByEmail
 * @desc    Retrieve a user's details using their email address
 * @access  Public (Authentication to be added later)
 *
 * This route searches for a user based on the email provided in the request body.
 * If found, it returns the user details excluding the password.
 */
router.post("/getUserByEmail", getUserByEmail);

/**
 * @route   POST /api/users/auth
 * @desc    Validates a user's credentials and issues them a JWT Token
 * @access  Public
 * 
 * This route searches for a user based on a given email address. The given password is then compared to
 * the stored and hashed password. If they match successfully, the user is given a JWT Token for access
 */
router.post("/auth", authenticateUser);

// Log successful loading of user routes to the console
console.log("userRoutes Loaded Successfully!");

// Export the router to be used in the main server file
module.exports = router;