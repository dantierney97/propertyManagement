// Imports
const bcrypt    = require("bcrypt");                // Import Bcrypt for password hashing
const { pool }      = require("../db/postgres");         // Import PSQL database connection
require('dotenv').config();                         // Loads environment variables

/**
 * Function to create a new user and store this in the database
 * @param {Object} req - The request object containing the user's details
 * @param {Object} res - The reponse object containing the stored details
 */

const createUser = async (req, res) => {
    // Extract the user's details from the request body
    const {name, email, password, role} = req.body;

    try {
        // Validate the user's role
        if (!['landlord', 'tenant', 'admin'].includes(role.toLowerCase())) // Converts input to lowercase to ensure case-matching 
        {
            return res.status(400).json({error: "Invalid Role!"});
        }

        // Generate a salt using SALT_ROUNDS value from .env
        const saltRounds = parseInt(process.env.SALT_ROUNDS);      // Determines the complexity of the hash

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert entry into database
        const result = await pool.query(
            "INSERT INTO users (name, email, password_hash, role)" +
            "VALUES ($1, $2, $3, $4)" +
            "RETURNING id, name, email, role", [name, email, hashedPassword, role]
        );

        // Output returned message
        res.status(201).json({
            message:"User created successfully!",
            user: result.rows[0]
        });

    }
    catch (error){
        console.error("Error creating user:", error.message);               // Output error message to console
        if (error.code === "23505") {
            return res.status(400).json({ error: "Email already exists!"});
        }
        res.status(500).json({ error: "Server Error!"});
    }
};

const getUserByEmail = async (req, res) => {
    // Extract the email address to be used for the search
    const { email } = req.body;

    try {
        // Validate that an email has been provided
        if (!email) {
            return res.status(400).json({ error: "An email address is required!"});
        }

        // Query the database for the user
        const result = await pool.query(
            "SELECT id, name, email, role FROM users WHERE email = $1",  // Excludes password
            [email]
        );

        // Check if the user exists
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "User not found!"});
        }

        // Return the user's details (excluding the password)
        res.json(result.rows[0]);
    }
    catch ( error ) {   // Catch any unhandled errors
        console.error("Error retrieving user email: ", error.message);
        res.status(500).json({ error: "Server Error!"});
    }
}

module.exports = { createUser, getUserByEmail };