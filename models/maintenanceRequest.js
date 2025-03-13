/**
 * Schema for Mongoose to store maintenance requests
 */

/**
 * Imports
 */
const mongoose = require('mongoose');   // Import mongoose

// Schema for maintenance update; this will be embedded in the main maintenance request
const MaintenanceUpdateSchema = new mongoose.Schema ({
    updated_by:     {type: String, ref: "user", required: true},
    description:    {type: String, required: true},
    timestamp:      {type: Date, default: Date.now}
});

// Schema for maintenance requests
const MaintenanceRequestSchema = new mongoose.Schema ({
    request_id:     {type: String, unique: true},       // Generated from timestamp, property_id & tenant_id
    property_id:    {type: String, ref: "Property", required: true},
    tenant_id:      {type: String, ref: "Tenant", required: true},
    description:    {type: String, required: true},
    status:         {type: String, enum: ["Open", "In Progress", "Closed"], default: "Open"},
    assigned_to:    {type: String, ref: "Contractor", default: null},
    created_at:     {type: Date, default: Date.now},
    updates:        [MaintenanceUpdateSchema] // Updates are embedded
});

// Pre-Save hook to generate request_id from given data
// This allows the ID to follow a known format which can make it easier to decipher if necessary
MaintenanceRequestSchema.pre("save", function (next) {
    if (!this.request_id) {
        // Format the timestamp to the following: YYYYMMDDHHMMSS (All special characters removed)
        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");

        // Generate the request_id by concatenating property_id, tenant_id, and the newly formatted timestamp
        this.request_id = `${this.property_id}${this.tenant_id}${timestamp}`;

        next();
    }
    else { next(); }
})



// Create the Mongoose Model
const MaintenanceRequest = mongoose.model("MaintenanceRequest", MaintenanceRequestSchema);

// Export the module
module.exports = MaintenanceRequest;