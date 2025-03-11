/**
 * Schema for Mongoose to store maintenance requests
 */

// Schema for maintenance update; this will be embedded in the main maintenance request
const MaintenanceUpdateSchema = new mongoose.Schema ({
    updated_by: {type: String, ref: "user", required: true},
    description: {type: String, required: true},
    timestamp:  {type: Date, default: Date.now}
});

// Schema for maintenance requests
const MaintenanceRequestSchema = new mongoose.Schema ({
    property_id: {type: String, ref: "Property", required: true},
    tenant_id: {type: String, ref: "Tenant", required: true},
    description: {type: String, required: true},
    status: {type: String, enum: ["Open", "In Progress", "Closed"], default: "Open"},
    created_at: {type: Date, default: Date.now},
    updates: [MaintenanceUpdateSchema] // Updates are embedded
});

// Create the Mongoose Model
const MaintenanceRequest = mongoose.model("MaintenanceRequest", MaintenanceRequestSchema);

// Export the module
module.exports = MaintenanceRequest;