const mongoose = require('mongoose');

// Define the schema for the 'pages' collection
const pageSchema = new mongoose.Schema({
  campaignName: {
    type: String,
  },
  businessData: [
    {
      businessName: {
        type: String,
      },
      link: {
        type: String,
      },
    },
  ],
  footerNavLinks: {
    type: [String], // An array of strings for footer navigation links
    required: true,
  },
  pageURL: {
    type: String,
    unique: true, // Ensure each page URL is unique
  },
});

// Create a model for the 'pages' collection
const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
