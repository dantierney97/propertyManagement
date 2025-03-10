// Import the 'pg' module (PostgreSQL Client for Node.js)
const { pool } = require("pg");

// Load environment files from the .env file
require("dotenv").config();

// Create a connection pool for PostgreSQL using credentials from .env
const pool = new Pool({
    user:       process.env.PG_USER,        // PSQL Username
    host:       process.env.PG_HOST,        // PSQL Host Address
    database:   process.env.PG_DATABASE,    // PSQL Database Name
    password:   process.env.PG_PASSWORD,    // PSQL Password
    prot:       process.env.PG_PORT,        // PSQL Port (Defualt: 5432)
});

/**
 * Function to test and establish the connection to PostgreSQL.
 */
const connectPostgres = async () => {
    try {
        // Get client from the connection pool
        const client = await pool.connect();
        console.log("Connected to PostgreSQL")

        // Release the client back to the pool
        client.release();
    }
    catch (error) {
        console.error("PostgreSQL connection error: ", error.message);
    }
};

// Export the pool (for making queries) and the connectPostgres function
module.exports = { pool, connectPostgres };