(function() {
    const targetAttribute = "mainEntityOfPage";
    const elements = document.querySelectorAll(`a[itemprop='${targetAttribute}']`);
    const data = [];

    elements.forEach((element) => {
        const businessName = element.textContent.trim();
        const link = element.href;
        data.push({ businessName, link });
    });

    // Scroll to the first element
    if (data.length > 0) {
        const firstElement = elements[0];
        firstElement.scrollIntoView({ behavior: "smooth" });

        // Perform actions on the selected element
        console.log("Selected element:", data[0]);

        // If there are more elements, select them sequentially
        let selectedIndex = 1;
        const scrollInterval = setInterval(() => {
            if (selectedIndex < data.length) {
                const nextElement = elements[selectedIndex];
                nextElement.scrollIntoView({ behavior: "smooth" });
                console.log("Selected element:", data[selectedIndex]);
                selectedIndex++;
            } else {
                clearInterval(scrollInterval);

                // All elements have been processed, send data to the background script
                console.log('Data:', data);

                chrome.runtime.sendMessage({ type: "footerLinks", data: data });

                // Continue the next task or resolve the promise with the data
            }
        }, 1000); // 5 seconds in milliseconds
    } else {
        // No data found on this page
        console.log('No data found on this page.');
    }
})();
