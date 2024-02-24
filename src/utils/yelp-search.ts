export const yelpSearch = async (category, location) => {
  console.log('here');
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
    return {
      businesses: [],
    };
  }

  const data = (await response.json()) as {
    businesses?: {
      name?: string;
      url?: string;
      review_count?: number;
      rating?: number;
      price?: string;
      location?: {
        address1?: string;
        city?: string;
        zip_code?: string;
        country?: string;
        state?: string;
      };
      phone?: string;
      categories?: { title?: string }[];
    }[];
  };

  return data;
};
