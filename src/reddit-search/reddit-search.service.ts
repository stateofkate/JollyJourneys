const fetch = require('node-fetch');

const googleSearch = async (query) => {
    const apiKey = 'YOUR_API_KEY';
    const cseId = 'YOUR_CUSTOM_SEARCH_ENGINE_ID';
    const url = `https://www.googleapis.com/customsearch/v1?q=${query}+site:reddit.com&key=${apiKey}&cx=${cseId}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to fetch from Google Custom Search');
    }
};

const redditSearch = async (query) => {
    const googleResponse = await googleSearch(query);
    const googleItems = googleResponse?.items || [];

    try {
        const redditJsonData = await Promise.all(
            googleItems.map(async (item) => {
                const jsonUrl = item.link + '.json';
                const response = await fetch(jsonUrl);
                const jsonData = await response.json();
                return jsonData;
            })
        );

        const items = redditJsonData.map((jsonItem) => {
            const postData = jsonItem[0].data.children[0].data;
            return postData.title; // Assuming you want the title as the snippet
        });

        const links = googleItems.map((item) => item.link);

        return { items, links };
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to process Reddit JSON data');
    }
};


const redditSearchResults = async (redditJsonData) => {

    for(const data of redditJsonData) {
        const jsonContent = await accessUrlAndReadObject(data.links);
        const parsedData = jsonContent.flatMap(listing =>
            listing.data.children.flatMap(child =>
                child.data.replies ? child.data.replies.data.children.map(reply => ({
                    body: reply.data.body,
                    ups: reply.data.ups,
                    downs: reply.data.downs // Assuming 'downs' is a field; it's not present in the provided JSON
                })) : []
            )
        );
        return parsedData;

    }

}


// Example usage
redditSearch('search query').then((result) => {
    console.log(result);
});



const accessUrlAndReadObject = async (url) => {

    try {
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