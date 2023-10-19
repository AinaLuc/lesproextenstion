console.log('initial script loading')
// contentScript.js (Content Script)
  console.log('Page has loaded its DOM in content script. Signaling background script.');

  // Signal the background script that the DOM is ready
  chrome.runtime.sendMessage({ type: "DOMContentLoaded" });

