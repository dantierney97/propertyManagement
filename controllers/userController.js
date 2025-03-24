// Import required modules
const jwt           = require("jsonwebtoken");      // JWT for token generation
const bcrypt        = require("bcrypt");            // Import Bcrypt for password hashing
const { pool }      = require("../db/postgres");    // Import PostgreSQL database connection pool
require('dotenv').config();                         // Load environment variables from .env file

/**
 * Create a new user and store the record in the database.
 *
 * This function handles user registration. It validates the provided role, 
 * hashes the password securely using Bcrypt, and inserts the user details into the database.
 *
 * @param {Object} req - The request object containing user details (name, email, password, role)
 * @param {Object} res - The response object used to send back the stored details or errors
 */
const createUser = async (req, res) => {
    try {
        // Extract user details from request body
        const { name, email, password, role } = req.body;

        // Validate the user's role (must be one of the predefined roles)
        if (!['landlord', 'tenant', 'admin'].includes(role.toLowerCase())) {
            return res.status(400).json({ error: "Invalid Role!" });
        }

        // Retrieve the number of salt rounds for hashing from the environment variables
        const saltRounds = parseInt(process.env.SALT_ROUNDS); // Determines hash complexity

        // Hash the user's password securely
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new user into the database
        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, role`, 
            [name, email, hashedPassword, role]
        );

        // Send a response confirming user creation, excluding password for security
        res.status(201).json({
            message: "User created successfully!",
            user: result.rows[0] // Return the inserted user (excluding the password)
        });

    } catch (error) {
        // Log the error message to the server console
        console.error("Error creating user:", error.message || error || error);

        // Handle duplicate email constraint violation
        if (error.code === "23505") {
            return res.status(400).json({ error: "Email already exists!" });
        }

        // Send a 500 response indicating a server-side error
        res.status(500).json({ error: "Server Error!" });
    }
};

/**
 * Retrieve a user from the database by email.
 *
 * This function searches the database for a user using their email address.
 * If found, it returns the user's details excluding the password.
 *
 * @param {Object} req - The request object containing the email address to search for
 * @param {Object} res - The response object used to return the user data or errors
 */
const getUserByEmail = async (req, res) => {
    try {
        // Extract the email address from the request body
        const { email } = req.body;

        // Ensure an email address was provided
        if (!email) {
            return res.status(400).json({ error: "An email address is required!" });
        }

        // Query the database to retrieve user details (excluding password)
        const result = await pool.query(
            `SELECT id, name, email, role FROM users WHERE email = $1`, 
            [email]
        );

        // If no user was found, return an error response
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Return the user's details (excluding password)
        res.json(result.rows[0]);

    } catch (error) {
        // Log the error to the server console
        console.error("Error retrieving user by email:", error.message || error);

        // Send a 500 response indicating a server-side error
        res.status(500).json({ error: "Server Error!" });
    }
};


/**
 * Authenticate a user by verifying their provided email address and password.
 * If successful, a JWT Token is returned to the user
 * 
 * @param {Object} req - The request object containing the email address and password given by the user
 * @param {Object} res - The response object used to return the JWT Token to the user.
 */
const authenticateUser = async (req, res) => {
    try {
        // Extracted user information from the request body
        const {email, password} = req.body;

        // Validate that the user sent an email address
        if(!email && !email.includes("@")) {
            return res.status(400).json({ error: "Please provide a valid email address!"});
        }

        // Check that password is not null
        if (!password) {
            return res.status(400).json({ error: "Please enter a password!"});
        }

        // Retrieve the user from the database
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);


    }
    catch ( error ) {
        // Log the error to the server console
        console.error("Error authenticating user:", error.message || error);

        // Send a 500 respinse indicating a server-side error
        res.status(500).json({ error: "Server Error!"});
    }
}


// Export the functions so they can be used in route handlers
module.exports = { createUser, getUserByEmail };