const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    trim: true
  },

  phone: {
    type: String,
    required: true,
    trim: true
  },

  designation: {
    type: String,
    required: true,
    trim: true
  },

  resumeUrl: {
    type: String,
    required: true
  },

  cloudinary_id: {
    type: String,
    required: true   // ✅ Cloudinary file public ID (used for delete)
  },

  status: {
    type: String,
    default: "pending",
    enum: ["pending", "approved", "rejected"]
  },

  comment: {
    type: String,
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Application', applicationSchema);
  