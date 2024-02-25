// Import necessary functions and types
import { googleSearch } from './google-search'; // Ensure you have the google-search.js setup

// Function to format the query and call the Google Custom Search API
const searchRedditOnGoogle = async (
  category: string,
  location: string,
): Promise<any[]> => {
  // Format the query to include "reddit" keyword
  const query = `reddit ${category} in ${location}`;

  // Call the Google Custom Search API with the formatted query
  const googleResponse = await googleSearch(query);

  // Process and map the Google search results
  return googleResponse.items.map((item) => ({
    title: item.title,
    link: item.link,
    snippet: item.snippet,
  }));
};

const search_reddit_on_google = async (query: any): Promise<any[]> => {
  // Split the query into category and location
  const [category, location] = query.query.split(':');

  // Search for "reddit {category} in {location}" on Google
  const items = await searchRedditOnGoogle(category, location);

  if (items.length === 0) {
    // Handle the case where no results are found
    return [
      {
        response:
          "I couldn't find any relevant results on Reddit for your query. Please try a different search.",
        links: [] as string[],
      },
    ];
  }

  // Return the search results directly
  return items;
};

export { search_reddit_on_google };
