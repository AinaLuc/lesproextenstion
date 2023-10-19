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
  },
  pageURL: {
    type: String,
  },
  used:{
    type:Boolean,
  }
});

// Create a model for the 'pages' collection
const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
