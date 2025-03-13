// Import the MaintenanceRequest model to interact with the MongoDB collection
const MaintenanceRequest = require("../models/maintenanceRequest");

/**
 * Create a new maintenance request
 * 
 * This function handles incoming requests to create a new maintenance request.
 * It extracts the required fields from the request body, creates a new document,
 * and saves it in MongoDB.
 *
 * @param {Object} req - The request object containing request data (property_id, tenant_id, description)
 * @param {Object} res - The response object used to return the result
 */
const createMaintenanceRequest = async (req, res) => {
    try {
        // Extract necessary data from request body
        const { property_id, tenant_id, description } = req.body;

        // Create a new MaintenanceRequest document using the provided data
        const newRequest = new MaintenanceRequest({
            property_id,  // ID of the property where maintenance is required
            tenant_id,    // ID of the tenant who raised the request
            description   // Description of the maintenance issue
        });

        // Save the new maintenance request to MongoDB
        await newRequest.save();

        // Send a response confirming the creation of the maintenance request
        res.status(201).json({ 
            message: "Maintenance request created successfully!", 
            request: newRequest 
        });
    } catch (error) {
        // Log error to the server console
        console.error("Error creating maintenance request:", error.message);

        // Send a 500 response indicating a server error
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Delete an existing maintenance request
 * 
 * This function will handle the deletion of a data request.
 * 
 * @param {Object} req - The request object that contains the request data
 * @param {Object} res - The response object used to return the result
 */
const deleteMaintenanceRequest = async (req, res) => {
    try {
        // Extract the request_id from the request object body
    const request_id = req.body;

    // Find the maintenance request that needs to be deleted
    const deleteRequest = await mongoose.findOneAndDelete({request_id});

    // If no request has been found, return a not-found error
    if (!deleteRequest) {
        return res.status(404).json({ error: "Maintenance Request not found!"});
    }

    // Return success message
    res.status(200).json({ message: "Maintenance Request deleted sucessfully!"});
    }
    catch (error) {
        console.error("Error deleting maintenance request")
        res.status(500).json({ error: "Server error!", message: error.message });
    }

}

/**
 * Add an update to an existing maintenance request
 * 
 * This function allows updates to be added to an existing maintenance request.
 * It retrieves the request by its ID, appends a new update to the "updates" array,
 * and saves the modified request.
 *
 * @param {Object} req - The request object containing update data (request_id, updated_by, description)
 * @param {Object} res - The response object used to return the result
 */
const addMaintenanceUpdate = async (req, res) => {
    try {
        // Extract update details from the request body
        const { request_id, updated_by, description } = req.body;

        // Find the maintenance request in the database by its ID
        const request = await MaintenanceRequest.findOne({request_id});

        // If the request does not exist, return an error response
        if (!request) {
            return res.status(404).json({ error: "Maintenance request not found!" });
        }

        // Append a new update entry to the updates array
        request.updates.push({
            updated_by,   // User who made the update
            description   // Description of the update
        });

        // Save the updated maintenance request in MongoDB
        await request.save();

        // Send a response confirming the update
        res.json({ 
            message: "Maintenance request updated successfully!", 
            request 
        });
    } catch (error) {
        // Log error to the server console
        console.error("Error updating maintenance request:", error.message);

        // Send a 500 response indicating a server error
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Assigns a maintenance request to a contractor or company
 * 
 * This function will allow an existing maintenance request to be assigned to a given contractor or company.
 * It retrieves the request by its ID, assigns a contractor_id to the relevant field, and saves the modified document.
 * 
 * @param {Object} req - The request object containg the contractor_id
 * @param {Object} res - The response object used to return the result
 */
const assignContractor = async (req, res) => {
    try {
        // Extract contractor details from the request body
        const { request_id, contractor_id} = req.body;

        // Find the relevant maintenance request by ID
        const request = await MaintenanceRequest.findOne({request_id});
        if (!request) {     // Checks that the request is not null to ensure that a request has been found
            return res.status(404).json({ error: "Maintenance Request not found"});
        }

        // Assign the request to the given contractor
        request.assigned_to = contractor_id;
        await request.save();

        // Output successful assignemnt of maintenance request
        res.json({ message: "Request assigned successfully!", request});
    }
    catch (error) {
        console.error("Error assigning request:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Allows for a user to retrieve maintenance requests by property, with optional filtering by status
 * 
 * This function will allow a user to retrieve all maintenance requests for a specific property.
 * It will retrieve the request by the property_id.
 * 
 * @param {Object} req - The request object containing the property_id
 * @param {Object} res - The response object used to return the result
 */
const getRequestsByProperty = async (req, res) => {
    try {
        // Extract the request_id from the body
    const { property_id, active_only} = req.body;

    // Ensure that property_id has been given
    if (!property_id) {
        return res.status(400).json({ error: "Property ID is required!"});
    }

    // Create query object

    let query = { property_id };

    // Check if the active_only filter was set to true
    if (active_only) {
        query.status({ $in: ["Open", "In Progress"] });
    }

    // Find all maintenance requests for the given query
    const requests = await MaintenanceRequest.find({query});

    // Check that results have been returned
    if (requests === 0) {
        return res.status(404).json({ error: "No Maintenance Requests found using that query!" });
    }

    // Return the results
    res.json({ message: "Maintenance Requests retrieved successfully!", requests });
    }
    catch ( error ) {
        console.error( "Error retrieving maintenance requests:", error.message );
        res.status(500).json({ error: "Server Error!",})
    }
}

// Export the functions so they can be used in other parts of the application
module.exports = { createMaintenanceRequest, deleteMaintenanceRequest, addMaintenanceUpdate,
     assignContractor,getRequestsByProperty };