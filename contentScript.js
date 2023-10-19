
// Function to extract information from the page
function extractDataFromElement(tdElement) {
    const emailLink = tdElement.querySelector("a[href^='mailto:']");
  
    const email = emailLink ? emailLink.getAttribute("href").replace("mailto:", "") : '';

    return email ;
}

// Extract data from all matching elements
const tdElements2 = document.querySelectorAll("td.colonne-60");
let email =''

for (const tdElement of tdElements2) {
    const textContent = tdElement.textContent;
    if (textContent.includes("Adresse électronique :")) {
         email = extractDataFromElement(tdElement);
        console.log('Extracted Data:', email);
        // Send the extracted data back to the background script for each matching element
        break; // If you want to exit the loop after finding the first email link
    }
}

  const businessNameElement = document.querySelector("h1.entry-title");

    const businessName = businessNameElement ? businessNameElement.textContent.trim() : '';
    const bizName = {businessName,email}
    console.log('business name',businessName)
  chrome.runtime.sendMessage({ type: "extractedData", data: bizName });



