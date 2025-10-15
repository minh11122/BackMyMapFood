const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password_hash: {
    type: String,
    required: function () {
      return this.provider === "local";
    },
  },

  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },

  provider_id: {
    type: String,
  },

  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE", "BANNED", "PENDING"],
    default: "PENDING",
  },

  email_verified: {
    type: Boolean,
    default: false,
  },

  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
}, { timestamps: true });

module.exports = mongoose.model("Account", accountSchema);
