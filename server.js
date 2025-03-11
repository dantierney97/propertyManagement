/**
 * Main Entry Point for the Server
 * 
 * This file initializes and starts the backend server for the Smart Property Management system.
 * It connects to both PostgreSQL and MongoDB, sets up middleware, and mounts API routes.
 */

// ==============================
// Module Imports
// ==============================

const express               = require('express');         // Import Express.js for handling web requests
const { connectPostgres }   = require("./db/postgres");   // Import PostgreSQL connection function
const connectMongo          = require("./db/mongo");      // Import MongoDB connection function
require('dotenv').config();                               // Load environment variables from .env

// ==============================
// Route Imports
// ==============================

const userRoutes        =   require("./routes/userRoutes");         // Import userRoutes for user-related API endpoints
const maintenanceRoutes =   require("./routes/maintenanceRoutes");  // Import maintenanceRoutes for user-related API endpoints

// ==============================
// Initialize Express Application
// ==============================

const app   =   express();                 // Create an Express application
const port  =   process.env.PORT || 5000;  // Set the server port (default to 5000 if not defined in .env)

// ==============================
// Middleware Configuration
// ==============================

app.use(express.json()); // Middleware to parse incoming JSON requests

// ==============================
// API Route Mounting
// ==============================

app.use("/api/users", userRoutes);                  // Mount userRoutes under the "/api" base path
app.use("/api/maintenance", maintenanceRoutes);     // Mount maintenanceRoots under the "/api" base path

// ==============================
// Main Application Logic
// ==============================

/**
 * Start the Server
 * 
 * This function:
 * 1. Logs the start of the backend service.
 * 2. Connects to both PostgreSQL and MongoDB.
 * 3. Starts the Express server on the defined port.
 */
const startServer = async () => {
    console.log("Starting Smart Property Management Backend..."); // Log startup message

    try {
        // Attempt connection to both databases
        await connectPostgres();  // Connect to the PostgreSQL database
        await connectMongo();     // Connect to the MongoDB database

        // Start Express server
        app.listen(port, () => {
            console.log(`Express Server running on http://localhost:${port}`); // Log server start
        });
    } catch (error) {
        console.error("Error starting the server:", error.message); // Log any errors
        process.exit(1); // Exit process if startup fails
    }
};

// ==============================
// Run the Server
// ==============================

startServer(); // Call the function to start the server