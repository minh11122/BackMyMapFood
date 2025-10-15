const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ["CUSTOMER", "SELLER_STAFF", "MANAGER_STAFF", "STORE_DIRECTOR", "ADMIN"]
    },
    description: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model("Role", roleSchema);