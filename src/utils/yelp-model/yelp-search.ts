export const yelpSearch = async (category: string, location: string) => {
  const apiKey =
    'gXROn5nWrR_dNNUkWtvYsSICZPWU7CVeEGa40ovxRB903G0IpHgEOk10C-UJXBq5LSiCYNgjTbT_8_iZ90lUJT39AjBPVwxYrx3sRS24iozlo_ZCAtj6AIw3O1zaZXYx'; // Ensure you have the Yelp API key in your environment variables
  const url = `https://api.yelp.com/v3/businesses/search?term=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Map the response to only include the required fields
  const businesses = data.businesses.map((business) => ({
    imageURL: business.image_url,
    description: business.name, // 'description' is now simply the business name
    latitude: business.coordinates.latitude,
    longitude: business.coordinates.longitude,
    uniqueID: business.id,
  }));

  return { businesses };
};
