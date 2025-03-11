// Import the 'pg' module (PostgreSQL Client for Node.js)
const { Pool } = require("pg");

// Load environment variables from the .env file
require("dotenv").config();

/**
 * PostgreSQL Connection Pool
 * 
 * Establishes a connection pool for PostgreSQL using credentials stored in environment variables.
 * The pool allows for efficient database queries without needing to reconnect each time.
 */
const pool = new Pool({
    user:       process.env.PG_USER,        // PostgreSQL Username
    host:       process.env.PG_HOST,        // PostgreSQL Host Address
    database:   process.env.PG_DATABASE,    // PostgreSQL Database Name
    password:   process.env.PG_PASSWORD,    // PostgreSQL Password
    port:       process.env.PG_PORT,        // PostgreSQL Port (Default: 5432) [Fixed typo: 'prot' -> 'port']
});

/**
 * Function to test and establish a connection to PostgreSQL.
 * 
 * This function attempts to connect to the PostgreSQL database and logs the connection status.
 * If successful, it releases the client back to the pool; if it fails, it logs an error.
 */
const connectPostgres = async () => {
    try {
        // Get a client from the connection pool
        const client = await pool.connect();
        console.log("Connected to PostgreSQL");

        // Release the client back to the pool for reuse
        client.release();
    } catch (error) {
        console.error("PostgreSQL connection error:", error.message);
    }
};

// Export the connection pool for executing queries, and the connectPostgres function for testing the connection
module.exports = { pool, connectPostgres };