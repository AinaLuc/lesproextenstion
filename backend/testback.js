async function query() {
  try {
    // Assuming businessData is a nested array, access the inner array
    const data = businessData[0]; // Access the first (and only) inner array

    for (const business of data) {
      // Now, you can access business.link without issues
      console.log('Business Name:', business.businessName);
      console.log('Link:', business.link);
      console.log('_id:', business._id);

      // If needed, you can use business.link in your further logic.
    }
  } catch (error) {
    console.error('Error querying businessData:', error);
  }
}

query();