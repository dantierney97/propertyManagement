// Import required modules
const express = require("express");
const { createMaintenanceRequest, addMaintenanceUpdate } = require("../controllers/maintenanceRequest");

// Create a new Express Router instance
const router = express.Router();

/**
 * @route   POST /api/maintenance/create
 * @desc    Create a new maintenance request
 * @access  Public (Authentication can be added later)
 */
router.post("/create", createMaintenanceRequest);

/**
 * @route   PUT /api/maintenance/update
 * @desc    Add an update to an existing maintenance request
 * @access  Public (Authentication can be added later)
 */
router.put("/update", addMaintenanceUpdate);

// Output successful route loading
console.log("maintenanceRoutes Loaded Successfully!");

// Export the router
module.exports = router;