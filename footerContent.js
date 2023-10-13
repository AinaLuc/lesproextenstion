setTimeout(() => {
                  //  console.log('Visiting link:', link);

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
                               
                                console.log('business data', businessData);

                                // Continue visiting the next link and resolve the promise with the data
                                  chrome.runtime.sendMessage({ type: "footerLinks", data: businessData });

                            }
                        }, 1000); // 5 seconds in milliseconds
                    } else {
                        // No business data on this page
                        resolve([]);
                    }
                }, 1000);