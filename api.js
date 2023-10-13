// api.js

   function sendBusinessDataToServer(businessData, footerNavLinks,campaignText,currenturl) {
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

// api.js
export async function sendBusinessInfo(businessInfo) {
  try {
    const response = await fetch('http://localhost:3000/api/savedBusinessInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(businessInfo),
    });

    if (!response.ok) {
      console.log(response);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

