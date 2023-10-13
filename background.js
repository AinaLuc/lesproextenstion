async function sendBusinessDataToServer(businessData, footerNavLinks,campaignText,currenturl) {
  console.log('campaignText',campaignText)
  const dataToSend = {
    businessData: businessData,
    footerNavLinks: footerNavLinks,
   campaignName: campaignText,
    pageURL:currenturl
  };

  try {
    const response = await fetch('http://localhost:3000/api/storeData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      console.log(response)
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

      async function visitLinksSequentially(links, tabId) {
    if (links.length === 0) {
        // All links have been visited
        console.log('All links have been visited.');
        return [];
    }

    const link = links.shift(); // Get and remove the first link from the array

    // Update the current tab's URL to the link
    return new Promise((resolve) => {
        chrome.tabs.update(tabId, { url: link }, (updatedTab) => {
            if (chrome.runtime.lastError) {
                console.error('Error updating tab URL:', chrome.runtime.lastError);
                resolve([]);
            } else {
                // Wait for a brief duration (e.g., 15 seconds) for the page to load

                // Get the link for each business

                setTimeout(() => {
                    console.log('Visiting link:', link);

                    // Add your code to process the page here
                    const itempropValue = "mainEntityOfPage";
                   // const currentUrl = window.location.href;
                    //console.log('current url', currentUrl);

                    // Customize the criteria to select all <a> elements with the specified itemprop value
                    const linkElements = document.querySelectorAll(`a[itemprop='${itempropValue}']`);
                    const businessData = [];

                    linkElements.forEach((linkElement) => {
                        const businessName = linkElement.textContent.trim();
                        const link = linkElement.href;
                        businessData.push({ businessName, link });
                    });

                    // Scroll to the first element
                    if (businessData.length > 0) {
                        const firstLinkElement = linkElements[0];
                        firstLinkElement.scrollIntoView({ behavior: "smooth" });
                        console.log('campaign text', campaignTexts);

                        // Perform any action on the selected element (e.g., store to MongoDB)
                        console.log("Selected element:", businessData[0]);

                        // If there are more elements to select, set a 5-second delay and then select the next one
                        let selectedElementIndex = 1;
                        const scrollInterval = setInterval(() => {
                            if (selectedElementIndex < businessData.length) {
                                const nextLinkElement = linkElements[selectedElementIndex];
                                nextLinkElement.scrollIntoView({ behavior: "smooth" });
                                console.log("Selected element:", businessData[selectedElementIndex]);
                                selectedElementIndex++;
                            } else {
                                clearInterval(scrollInterval);

                                // All elements selected, send a message to the background script
                                const footerNavLinks = scrapeFooterNavLinks();
                                console.log('business data', businessData);

                                // Continue visiting the next link and resolve the promise with the data
                                visitLinksSequentially(links, tabId)
                                    .then((nextBusinessData) => resolve(businessData.concat(nextBusinessData)));
                            }
                        }, 1000); // 5 seconds in milliseconds
                    } else {
                        // No business data on this page
                        resolve([]);
                    }
                }, 15000); // Adjust the wait time as needed
            }
        });
    });
}

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.type === "selectionComplete") {
        // Handle the extracted data here
        console.log('working');

        try {
            const responseData = await sendBusinessDataToServer(
                request.businessData,
                request.footerNavLinks,
                request.campaignTexts,
                request.currentUrl
            );

            // Get the current active tab
            const [currentTab] = await new Promise((resolve) => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    resolve(tabs);
                });
            });

            if (!currentTab) {
                console.error('No active tab found.');
                return;
            }

            //Inject footer script 

            // Function to inject a content script into a tab
const injectFooterScript = async (tabId, link, scriptFileName) => {
    // Check if the link is a chrome:// URL
    if (link.startsWith('chrome://')) {
        console.warn(`Skipping chrome:// URL: ${link}`);
        return;
    }

    // Update the current tab's URL to the desired link
    await new Promise((resolve) => {
        chrome.tabs.update(tabId, { url: link }, (updatedTab) => {
            if (chrome.runtime.lastError) {
                console.error('Error updating tab URL:', chrome.runtime.lastError);
                resolve();
            } else {
                // Inject the specified content script into the current tab
                chrome.scripting.executeScript({
                    target: { tabId: updatedTab.id },
                    files: [scriptFileName], // Specify the content script file to inject
                }, () => {
                    resolve();
                });
            }
        });
    });
};

// Example: Inject content scripts into multiple tabs with different links
//const exampleLinks = ["https://example1.com", "https://example2.com", "https://example3.com"];

const linksFooter = responseData.footerNavLinks;

// Define the index to keep track of the current link
let currentIndex = 1;

// Function to process the links sequentially
const processLinksSequentially = () => {
    if (currentIndex < linksFooter.length) {
        const link = linksFooter[currentIndex];

        // Inject the content script and wait for 10 seconds
        injectFooterScript(currentTab.id, link, "footerContent.js");

        // Move to the next link after waiting
        currentIndex++;

        // Call the function recursively for the next link
        setTimeout(processLinksSequentially, 1000); // Optional delay between links
    } else {
        // All links have been processed
        console.log('All links have been processed.');
    }
};

// Start processing the links sequentially
processLinksSequentially();

   

            
          



            // Define a function to inject the content script into the current tab
            const injectContentScript = async (tabId, link) => {
                // Check if the link is a chrome:// URL
                if (link.startsWith('chrome://')) {
                    console.warn(`Skipping chrome:// URL: ${link}`);
                    return;
                }

                // Update the current tab's URL to the desired link
                await new Promise((resolve) => {
                    chrome.tabs.update(tabId, { url: link }, (updatedTab) => {
                        if (chrome.runtime.lastError) {
                            console.error('Error updating tab URL:', chrome.runtime.lastError);
                            resolve();
                        } else {
                            // Inject the content script into the current tab
                            chrome.scripting.executeScript({
                                target: { tabId: updatedTab.id },
                                files: ['contentScript.js'],
                            }, () => {
                                resolve();
                            });
                        }
                    });
                });
            };

            // Extract and process data from the tab's content sequentially
            for (const business of responseData.businessData) {
                await injectContentScript(currentTab.id, business.link);

                // Add a delay if needed to allow time for contentScript.js to execute and send data
                await new Promise((resolve) => setTimeout(resolve, 10000));
            }

            console.log('Server response:', responseData);

        } catch (error) {
            console.error('Error sending data to server:', error);
        }
    }
});

// Handle the message from the content script
chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    if (message.type === "extractedData") {
        const extractedData = message.data;

        console.log('extracted data',extractedData)

        // Send the extracted data to your endpoint
      try {
            const response = await fetch('http://localhost:3000/api/savedBusinessInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(extractedData),
            });

            if (!response.ok) {
                console.log(response);
                // Handle any errors here
            } else {
                const responseData = await response.json();
                console.log('Server response:', responseData);
                // Handle the response from your endpoint as needed
            }
        } catch (error) {
            console.error('Error sending data to server:', error);
            // Handle any errors here
        }
    }
    
});

//Script for footer data getter

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "footerLinks") {
        // Handle message type 1
        console.log("Received message type 1:", request.data);
    }
});

// Background Script (background.js)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log('message',message)

    if (message.type === "visitLinks") {

        console.log('message',message)
        const  links  = message.url;
        const tabId = sender.tab.id;
        console.log('links',links)
        
        // Function to visit links sequentially
        async function visitLinksSequentially() {
            for (const link of links) {
                // Update the current tab's URL to the link
                chrome.tabs.update(tabId, { url: link }, (updatedTab) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error updating tab URL:', chrome.runtime.lastError);
                    } else {
                                                    
                                                    console.log('else bg')

                                                                    // Background Script (background.js)
                    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

                        console.log('message checking')
                        if (message.type === "pageLoaded") {
                            // Extracted data from the loaded page
                            console.log('message content script',message)

                            // Send the data to the popup
                            chrome.runtime.sendMessage({ type: "extractedData", data: pageData });
                        }
                    });


                                                    sendResponse({ message: `Visited link: ${link}` });

                        // Wait for a brief duration (e.g., 5 seconds) for the page to load
                        setTimeout(() => {
                            console.log('Visiting link:', link);
                            
                            // Add your code to process the page here
                            
                            // Continue visiting the next link
                        }, 15000); // Adjust the wait time as needed
                    }
                });

                // Wait for the page to load or for the timeout, if needed
                await new Promise((resolve) => setTimeout(resolve, 15000));
            }
            
            // All links visited
        }
        
        // Start visiting links
        visitLinksSequentially();
        
        // Indicate that the response will be sent asynchronously
        return true;
    }
});


