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

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust this to your security needs
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


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
      used:false,
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
      email: businessInfo.email, // Use the correct key to access the email data
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

// Create an endpoint to save page data
app.post('/api/savePageData', async (req, res) => {
  const pageDataArray = req.body; // An array of objects received from the extension

  // Create a new Page document
  const newPage = new Page({
    businessData: pageDataArray,
  });

  // Save the new Page document to the database
  newPage.save()
    .then((result) => {
      console.log('Page document saved:', result);

      // Send a response with the saved data
      res.status(200).json(result);
    })
    .catch((error) => {
      console.error('Error saving Page document:', error);
      res.status(500).send('Error saving Page document');
    });
});


// Create a route to retrieve all businessData from all pages
app.get('/api/businessData', async (req, res) => {
  try {
    // Retrieve all pages from the database
    const pages = await Page.find();

    // Create a copy of the retrieved pages to send the initial state to the front end
    const initialPages = pages.map((page) => ({
      businessData: page.businessData,
      used: page.used, // Initial state is false
    }));

    // Send the initial state to the front end
    res.json(initialPages);

    // Now, you can update the 'used' field in the database
    for (const page of pages) {
      page.used = true;
      await page.save(); // Save the updated page
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve businessData' });
  }
});






app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
