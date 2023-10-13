import sendBusinessInfo  from './api.js';


// Function to extract information from the page
            function extractData() {
                const emailLink = document.querySelector("a[href^='mailto:']");
                const businessNameElement = document.querySelector("h1.entry-title");

                const businessName = businessNameElement ? businessNameElement.textContent.trim() : '';
                const email = emailLink ? emailLink.textContent : '';

                return { businessName, email };
            }

            // Extract the data
            const extractedData = extractData();

            // Send the extracted data using sendBusinessInfo
            sendBusinessInfo(extractedData);
        