// business.js

const mongoose = require('mongoose');

// Define the schema for the Business model
const businessSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  // Add other fields as needed
});

// Create the Business model
const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
