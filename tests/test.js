/**
 * 🚀 Main Test Runner
 * -------------------
 * This script initializes testing by calling specific test files.
 */

const testMaintenanceRequests = require("./dataTests/testMaintenanceRequests"); // Import and execute maintenance request tests
const testUserController = require("./dataTests/testUserController");   // Import and execute user controller tests

/**
 * Add Imported test functions here
 */

testMaintenanceRequests();  // Runs tests for maintenance requests
console.log("Maintenance Requests testing complete!");

testUserController();             // Runs tests for User functionality
console.log("User Controller tests complete!");