const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
        unique: true,
    },
    full_name: {
        type: String,
        sparse: true, 
    },
    phone: {
        type: String
    },
    avatar_url: {
        type: String,
    },
    date_of_birth: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE", "OTHER"],
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);