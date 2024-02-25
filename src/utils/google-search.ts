
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;


export interface RedditPost {
  title: string,
  redditLink: string,
}
const searchReddit = async (category: string, location: string): Promise<any[]> => {
  // Assuming query is structured as "searchTerm"

  const query = `${category} in ${location}`
  const searchTerm = query; // Directly using the search term
  const apiKey = 'YOUR_API_KEY';
  const cseId = 'YOUR_CUSTOM_SEARCH_ENGINE_ID';

  // Constructing the Google Custom Search API URL for reddit.com results
  const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${searchTerm}+site:reddit.com&key=${apiKey}&cx=${cseId}`;

  try {
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.items && searchData.items.length > 0) {
      const redditJsonData:RedditPost[] = await Promise.all(
          searchData.items.map(async (item: any) => {
            // Appending '.json' to Reddit URLs to get the JSON representation
            const jsonUrl = item.link + '.json';
            const jsonResp = await fetch(jsonUrl);
            return jsonResp.json(); // Returning the JSON response
          })
      );

      // Mapping the JSON data to include only necessary fields
      return redditJsonData.map((jsonItem: any) => ({
        title: jsonItem[0].data.children[0].data.title, // Example field, adjust as needed
        redditLink: jsonItem[0].data.children[0].data.permalink, // Example field, adjust as needed
      }));
    }

    // Handling the case where no results are found
    return [
      {
        response: "I couldn't find any Reddit posts matching your search. Please try a different search.",
        links: [] as string[],
      },
    ];
  } catch (error) {
    console.error('Error:', error);
    return [
      {
        response: 'An error occurred while fetching data. Please try again later.',
        links: [] as string[],
      },
    ];
  }
};


export const searchRedditResponse = (redditJsonData: RedditPost[]) => {
  for (const URL of redditJsonData) {
    const redditJsonContent = accessUrlAndReadObject(URL.redditLink)
  }
}

const accessUrlAndReadObject = async (url) => {
  try{
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json(); // Assuming the URL returns a JSON object
    return data; // This is the JSON object you're interested in
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};

const url = 'https://example.com/data.json'; // Replace this with the actual URL you want to access
accessUrlAndReadObject(url).then(data => {
  console.log('Data fetched from the URL:', data);
});

 export const googleSearch = async (category: string, location: string) => {
  const url = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json');

  // Combine the 'category' and 'location' into a single query
  const query = `${category} in ${location}`;

  // Update the fields parameter to include 'photos'
  const params = {
    input: query,
    inputtype: 'textquery',
    fields: 'formatted_address,name,rating,opening_hours,geometry,photos', // Include 'photos' in the fields
    key: process.env.GOOGLE_MAPS_API_KEY
  };

  url.search = new URLSearchParams(params).toString();

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      return {
        items: [],
      };
    }

    const data = await response.json() as {
      candidates?: {
        name?: string;
        formatted_address?: string;
        rating?: number;
        opening_hours?: {
          open_now?: boolean;
        };
        geometry?: {
          location?: {
            lat?: number;
            lng?: number;
          };
        };
        photos?: [{ // Assuming there's at least one photo in the array
          photo_reference?: string;
          height?: number;
          width?: number;
        }];
      }[];
    };

    const items = data.candidates?.map(candidate => ({
      title: candidate.name,
      link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(candidate.formatted_address ?? '')}`,
      snippet: candidate.formatted_address,
      photoReference: candidate.photos?.[0]?.photo_reference // Get the photo reference of the first photo
    })) ?? [];

    return { items };
  } catch (error) {
    console.error('Error fetching data from Google Places API:', error);
    return {
      items: [],
    };
  }
};

const getPhotoUrl = (photoReference: string) => {
  const url = new URL('https://maps.googleapis.com/maps/api/place/photo');
  const params = {
    maxwidth: '400', // or maxheight
    photoreference: photoReference,
    key: process.env.GOOGLE_MAPS_API_KEY
  };

  url.search = new URLSearchParams(params).toString();
  return url.toString();
};