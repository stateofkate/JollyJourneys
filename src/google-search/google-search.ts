
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.get('/search', async (req, res) => {
    const query = req.query.q; // Your search query
    const apiKey = 'YOUR_API_KEY';
    const cseId = 'YOUR_CUSTOM_SEARCH_ENGINE_ID';

    const url = `https://www.googleapis.com/customsearch/v1?q=${query}+site:reddit.com&key=${apiKey}&cx=${cseId}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const redditUrls = data.items.map(item => item.link);

        const redditJsonData = await Promise.all(
            redditUrls.map(async (url) => {
                const jsonUrl = url + '.json';
                const response = await fetch(jsonUrl);
                return response.json();
            })
        );

        return res.json(redditJsonData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
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