import { yelpSearch } from './yelp-search'; // Ensure you have the yelp-search.js setup

// Yelp search integration adjusted to the new format
const yelp = async (category: string, location: string): Promise<any[]> => {
  const yelpResponse = await yelpSearch(category, location);
  return yelpResponse.businesses.map((business) => ({
    imageURL: business.imageURL,
    description: business.description, // Now just the name
    latitude: business.latitude,
    longitude: business.longitude,
    UniqueID: business.uniqueID,
  }));
};

const search_yelp_api = async (query: any): Promise<any[]> => {
  // Assuming query is structured as "category:location"
  const [category, location] = query.query.split(':');
  const items = await yelp(category, location);

  if (items.length === 0) {
    // Handling the case where no results are found
    return [
      {
        response:
          "I couldn't find any results for your query. Please try a different search.",
        links: [] as string[],
      },
    ];
  }

  // Directly return the items without further processing
  return items;
};

export { search_yelp_api };
