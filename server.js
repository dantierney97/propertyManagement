/**
 * Main Entry Point for Server
 */

// Module Imports
const express = require('express');                     // Express.js for handling web requests
const {connectPostgres} = require("./db/postgres");     // Import Postgres connection function
const connectMongo = require("./db/mongo");             // Import MongoDB connection function
const { connect } = require('mongoose');
require('dotenv').config();

// Initialise Express
const app = express();
const port = process.env.PORT;      // Set the server port

// Setup Middleware to parse json
app.use(express.json());

/**
 * Main Application
 */

const startServer = async () => {

    console.log("Starting Smart Property Management Backend...");   // Output start of startup

    // Attempt connection to both databases
    await connectPostgres();            // Test connection to the Postgres server
    await connectMongo();               // Test connection to the MongoDB server

    // Start Express server
    app.listen(port, () => {
        console.log(`Express Server running on http://localhost:${port}`);
    });

};

// Run Main Loop
startServer();