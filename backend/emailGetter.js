const mongoose = require('mongoose');
const Business = require('./business'); // Import your Business model
const emailValidator = require('email-validator');
const fs = require('fs');
const dns = require('dns');
const csv = require('csv-parser');

// Establish a connection to MongoDB
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a Set to store unique valid emails
const uniqueValidEmails = new Set();

// Define a function to clean and validate email addresses
function cleanAndValidateEmail(email) {
  if (email && typeof email === 'string') {
    // Trim whitespace and convert to lowercase
    let cleanedEmail = email.trim().toLowerCase();

    // Split the email into parts
    let emailParts = cleanedEmail.split('@');

    // Check if the email has at least two parts (local part and domain)
    if (emailParts.length >= 2) {
      // Extract the domain part
      let domain = emailParts[1];

      // Remove extra words after the TLD
      const domainParts = domain.split('.');
      if (domainParts.length >= 2) {
        domain = domainParts.slice(0, 2).join('.');
      }

      // Check if the email is valid
      if (emailValidator.validate(email)) {
        return email;
      }
    }
  }

  return null; // Invalid email or not in the expected format
}

// Define a function to check the MX or DNS
function checkMXorDNS(email, callback) {
  const domain = email.split('@')[1];

  dns.resolveMx(domain, (err, addresses) => {
    if (err || !addresses || addresses.length === 0) {
      // DNS or MX lookup failed, indicating an invalid domain
      callback(false);
    } else {
      // Valid domain with MX records
      callback(true);
    }
  });
}

// Define a function to process the businesses and save valid emails to a CSV
async function processBusinesses() {
  try {
    const businesses = await Business.find({
      email: { $exists: true, $ne: "" }, // Filter out documents with no email or empty email
    }).exec();

    console.log('business', businesses);

    let validEmailCount = 0; // Counter for valid emails

    for (const business of businesses) {
    

      let cleanedEmail = cleanAndValidateEmail(business.email);

      if (cleanedEmail) {
        const isValid = await new Promise((resolve) => {
          checkMXorDNS(cleanedEmail, resolve);
        });

        if (isValid) {
          // Add the email to the Set to ensure uniqueness
          uniqueValidEmails.add(cleanedEmail);
          validEmailCount++;
        }
      }
    }
      console.log('valid email count',validEmailCount)
    // All businesses processed, save valid emails to a CSV
    saveValidEmailsToCSV(Array.from(uniqueValidEmails));
  } catch (err) {
    console.error('Error retrieving or processing businesses:', err);
  }
}

// Define a function to save valid emails to a CSV file
function saveValidEmailsToCSV(emails) {
  const filename = 'valid_emails_agency_rev2.csv';

  // Create a write stream to the CSV file
  const writeStream = fs.createWriteStream(filename);

  // Write the header row
  writeStream.write('Business Name,Email\n');

  // Write each row
  for (const email of emails) {
    writeStream.write(`${email.businessName},${email}\n`);
  }

  // Close the write stream
  writeStream.end(() => {
    console.log('Valid emails saved to', filename);
  });
}

// Start the processing
processBusinesses();
