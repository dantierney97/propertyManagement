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
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser:    true,          // Ensures compatibility with modern MongoDB Versions
            useUnifiedTopology: true,       // Use the new server discovery and monitoring engine
        });
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("MongoDB Connection Error: ", error.message);
    }
};

// Export the connectMongo function
module.exports = connectMongo;