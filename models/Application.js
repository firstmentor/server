const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  designation: String,
  resumeUrl: String,
  status:{
    type:String,
    default:"panding"
  },
  comment:{
    type:String,
    default:"panding"
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Application', applicationSchema);
