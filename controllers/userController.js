// Imports
const bcrypt    = require("bcrypt");                // Import Bcrypt for password hashing
const pool      = require("./db/postgres");         // Import PSQL database connection
require('dotenv').config();                         // Loads environment variables

/**
 * Function to create a new user and store this in the database
 * @param {Object} req - The request object containing the user's details
 * @param {Object} res - The reponse object containing the stored details
 */

const createUser = async () => {
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
        const id;
        const result = await pool.query(
            "INSERT INTO users (name, email, password_hash, role)" +
            "VALUES ($1, $2, $3, $4)" +
            "RETURNING id, name, email, role", [id, name, email, role]
        );

        // Output returned message
        res.status(201).json({
            message:"User created successfully!",
            user: result.rows[1]
        });

    }
    catch (error){
        console.error("Error creating user:", error.message);
        if (error.code === "23505") {
            return res.status(400).json({ error: "Email already exists!"});
        }
        res.status(500).json({ error: "Server Error!"});
    }
}