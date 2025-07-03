// models/Requirement.js
const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema({
  name: String,
  businessName:String,
  email: String,
  phone: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Requirement", requirementSchema);
