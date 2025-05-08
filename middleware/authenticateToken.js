const jwt = require("jsonwebtoken");
/**
 * Middleware that will allow the server to check the authentication of a user
 * before allowing that user to run any backend functions
 * 
 * If the token is valid, the user's information will be attached to 'req.user'
 * If invalid, this will return a 401 or 403 error
 */

const authenticateToken = (req, res, next) => {
    // Get the token from the authorization header
    const authHeader = req.header("Authorization");

    // Check if a token has been provided
    if (!authHeader) {
        return res.status(401).json({ error: "Access Denied. No Token Provided!" });
    }

    // Remove 'bearer' prefix from token
    const token = authHeader.replace('Bearer ', "");

}

module.exports = authenticateToken;

