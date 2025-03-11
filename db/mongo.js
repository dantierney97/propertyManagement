// Import the Mongoose Library (used to interact with MongoDB)
const mongoose = require("mongoose");

// Load environment variables from the .env file
require ("dotenv").config();

/**
 * Function to connect to MongoDB using the given URI in .env
 */
const connectMongo = async () => {
    try {
        // Attempt to connect using mongoose
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("MongoDB Connection Error: ", error.message);
        process.exit(1); // Exit process if the connection fails
    }
};

// Export the connectMongo function
module.exports = connectMongo;