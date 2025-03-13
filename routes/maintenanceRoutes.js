// Import required modules
const express = require("express");
const { createMaintenanceRequest, addMaintenanceUpdate, assignContractor, getAllRequestsByProperty, deleteMaintenanceRequest } = 
        require("../controllers/maintenanceRequestController");

// Create a new Express Router instance
const router = express.Router();

/**
 * @route       POST /api/maintenance/create
 * @desc        Create a new maintenance request
 * @access      Public (Authentication to be added later)
 */
router.post("/create", createMaintenanceRequest);

/**
 * @route       POST /api/maintenance/deleteMaintenanceRequest
 * @desc        Deletes an exisiting maintenance request
 * @access      Public (Authentication to be added later)
 */
router.post("/deleteMaintenanceRequest", deleteMaintenanceRequest);

/**
 * @route       PUT /api/maintenance/update
 * @desc        Add an update to an existing maintenance request
 * @access      Public (Authentication to be added later)
 */
router.put("/update", addMaintenanceUpdate);

/**
 * @route       PUT /api/maintenance/assignContractor
 * @desc        Assign a contractor to an existing maintenance request
 * @access      Public (Authentication to be added later)
 */
router.put("/assignContractor", assignContractor);

/**
 * @route       POST /api/maintenance/getRequestsByProperty
 * @desc        Retrieves all maintenance requests for a given property regardless of status
 * @access      Public (Authentication to be added later)    
 */
router.post("/getRequestsByProperty", getRequestsByProperty);

// Output successful route loading
console.log("maintenanceRoutes Loaded Successfully!");

// Export the router
module.exports = router;