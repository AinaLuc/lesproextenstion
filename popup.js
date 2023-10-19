document.addEventListener("DOMContentLoaded", function () {

    // Function to set campaign name in localStorage
    function setCampaignName(newValue) {
        localStorage.setItem("campaignName", newValue);
    }

    // Function to get campaign name from localStorage
    function getCampaignName() {
        return localStorage.getItem("campaignName") || "";
    }

    // Function to visit footer links sequentially


    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

        const startSelectionButton = document.getElementById("startSelectionButton");
        const campcontainer = document.getElementById("campcontainer");
        const contentDiv = document.getElementById("contentDiv");
        const addCampaignButton = document.getElementById("addCampaignButton");

           const activeTab = tabs[0];
        const tabId = activeTab.id; // Capture tabId here

        // Hide buttons initially
        startSelectionButton.style.display = "none";

        // Enable buttons when campaign name is provided
        addCampaignButton.addEventListener("click", function () {
            const campaignNameInput = document.getElementById("campaignName");
            const campaignName = campaignNameInput.value; // Retrieve campaign name from the input field

            if (campaignName !== "") {
                startSelectionButton.style.display = "inline-block";
                campcontainer.style.display = "none";
                setCampaignName(campaignName); // Store campaign name in localStorage
                contentDiv.textContent = localStorage.getItem("campaignName");

                const campaignButton = document.getElementById("campaign");
                campaignButton.textContent = campaignName;
                campaignButton.style.display = "block";
            } else {
                startSelectionButton.style.display = "none";
            }
        });

        // Start the element selection process with scrolling
        startSelectionButton.addEventListener("click", function () {
            const campaignButton = document.getElementById("campaign");
            const campaignTexts = campaignButton.textContent;
     
                    contentDiv.textContent =tabId



            chrome.scripting.executeScript({
                target: { tabId: tabId },
                args: [campaignTexts,activeTab],
                function:  (campaignTexts,activeTab) => {
                           // console.log('tab id 0',tabId)

                    const itempropValue = "mainEntityOfPage";
                    const currentUrl = window.location.href;
                    console.log('current url', currentUrl);

                    // Customize the criteria to select all <a> elements with the specified itemprop value
                    const linkElements = document.querySelectorAll(`a[itemprop='${itempropValue}']`);
                    const businessData = [];

                    linkElements.forEach((linkElement) => {
                        const businessName = linkElement.textContent.trim();
                        const link = linkElement.href;
                        businessData.push({ businessName, link });
                    });
/*// Function to visit footer links sequentially
function visitFooterLinksSequentially(footerNavLinks) {
    let linkIndex = 0;
    function visitNextLink(footerNavLinks) {
           console.log(footerNavLinks)

        if (linkIndex < footerNavLinks.length) {
            chrome.runtime.sendMessage({ type: "visitLinks", url: footerNavLinks }, (response) => {
                console.log('response',response)
                if (response.error) {
                    console.error('Error updating tab URL:', response.error);
                } else {
                    setTimeout(() => {
                        console.log('Visiting footer link:', link);

                        // Add your code to process the footer page here
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

                                    // All elements selected, continue to the next footer link
                                    linkIndex++;
                                    visitNextLink();
                                }
                            }, 1000); // 5 seconds in milliseconds
                        }
                    }, 5000); // Adjust the wait time as needed
                }
            });
        }
    }

}*/

      /*   function scrapeFooterNavLinks() {
    const navLinks = document.querySelectorAll("#nav-old-below select option");
    const footerNavLinks = [];

    // Limit the number of links to two
    for (let i = 0; i < 3  && i < navLinks.length; i++) {
        footerNavLinks.push(navLinks[i].value);
    }

    return footerNavLinks;
}*/

  function scrapeFooterNavLinks() {
                const navLinks = document.querySelectorAll("#nav-old-below select option");
                const footerNavLinks = [];
                navLinks.forEach((option) => {
                    footerNavLinks.push(option.value);
                });
                return footerNavLinks;
            }


                   

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
                                console.log('business data',businessData)
                              
                     // Get the current active tab
                              //  console.log('tab ud',tabId)
                                         //visitFooterLinksSequentially(footerNavLinks);
                                 chrome.runtime.sendMessage({
                                    type: "selectionComplete",
                                    businessData,
                                    footerNavLinks,
                                    campaignTexts, // Retrieve campaign name from localStorage
                                    currentUrl
                                });
 









                            }
                        }, 1000); // 5 seconds in milliseconds
                    }
                },
            });
        });


    });
});