// Get the current URL
const currentUrl = window.location.href;

// Define URL patterns to exclude
const excludePatterns = [
  "http://les-professionnels-de-madagascar.com/category/voyage-tourisme/agence-de-voyages/",
  // Add more patterns as needed
];

// Check if the current URL matches any of the exclude patterns
const shouldRun = excludePatterns.every(pattern => !currentUrl.startsWith(pattern));

// If shouldRun is true, execute your code
if (shouldRun) {

// Function to visit footer links sequentially
function visitFooterLinksSequentially(footerNavLinks) {
    let linkIndex = 0;

    function visitNextLink() {
        if (linkIndex < footerNavLinks.length) {
            // You need to define itempropValue and campaignTexts in your code
                 const itempropValue = "mainEntityOfPage";

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
                        console.log("Selected element content:", businessData[selectedElementIndex]);
                        selectedElementIndex++;
                    } else {
                        clearInterval(scrollInterval);

                        // All elements selected, continue to the next footer link
                        linkIndex++;
                        visitNextLink();
                    }
                }, 5000); // 5 seconds in milliseconds
            }
        }
    }

      


}
function scrapeFooterNavLinks() {
                const navLinks = document.querySelectorAll("#nav-old-below select option");
                const footerNavLinks = [];
                navLinks.forEach((option) => {
                    footerNavLinks.push(option.value);
                });
                return footerNavLinks;
            }
const footerNavLinks = scrapeFooterNavLinks();


visitNextLink(footerNavLinks); // Start the process






// Content Script (content.js)
chrome.runtime.sendMessage({ type: "pageLoaded", data: "Your page data" });

}
else{
  console.log('excluded')
}

