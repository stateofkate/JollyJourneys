export const yelpSearch = async (category, location) => {
  const apiKey = process.env.YELP_API_KEY; // Ensure you have the Yelp API key in your environment variables
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
