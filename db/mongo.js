// Import the Mongoose Library (used to interact with MongoDB)
const mongoose = require("mongoose");

// Load environment variables from the .env file
require("dotenv").config();

/**
 * Connect to MongoDB
 * 
 * This function establishes a connection to the MongoDB database using the connection URI
 * specified in the .env file. If the connection fails, the process will exit with an error.
 */
const connectMongo = async () => {
    try {
        // Attempt to establish a connection to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,         // Enables the new URL parser
            useUnifiedTopology: true       // Enables the new Server Discovery and Monitoring engine
        });

        console.log("Connected to MongoDB"); // Log success message
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message); // Log error message
        process.exit(1); // Exit the process if the connection fails
    }
};

// Export the connectMongo function for use in other parts of the application
module.exports = connectMongo;