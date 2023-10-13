const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors middleware
const Page = require('./pages'); // Adjust the path 
const Business = require('./business'); // Adjust the path accordingly


const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

app.post('/api/storeData', async (req, res) => {
  const data = req.body; // Data received from the extension
console.log('req.body',req.body.campaignName)
  try {
    // Map data from req.body to the Page model
    const pageData = {
      campaignName: data.campaignName,
      businessData: data.businessData, // Map businessData directly
      footerNavLinks: data.footerNavLinks,
      pageURL: data.pageURL,
      // You can add more fields here if needed
    };

    // Create a new Page document
    const page = new Page(pageData);

    // Save the data to MongoDB
    await page.save();

    console.log('Data inserted into MongoDB:', page);
    res.status(200).json(page);

  } catch (error) {
    console.error('Error inserting data into MongoDB:', error);
    res.status(500).send('Error inserting data into MongoDB');
  }
});

// server.js

app.post('/api/savedBusinessInfo', async (req, res) => {
  const businessInfo = req.body; // Data received from the extension

  try {
    // Map data from req.body to the Business model (assuming you have a Business model)
    const businessData = new Business({
      // Map the fields as needed
      businessName: businessInfo.businessName,
      email: businessInfo.dataEmail, // Use the correct key to access the email data
      // Add other fields as needed
    });

    // Save the business data to MongoDB
    await businessData.save();

    console.log('Business Info Inserted into MongoDB:', businessData);
    res.status(200).json(businessData);

  } catch (error) {
    console.error('Error inserting business info into MongoDB:', error);
    res.status(500).send('Error inserting business info into MongoDB');
  }
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
