// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  designation: { type: String, required: true },
  experience: { type: String, required: true },
  location: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
