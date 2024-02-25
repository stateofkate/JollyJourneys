export const googleSearch = async (query: string) => {
  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=AIzaSyBMM8Wn_ADP5V7yYRZYAQHfVevRGnZLPzM&q=${query}`,
  );

  if (!response.ok) {
    return {
      items: [],
    };
  }

  const data = (await response.json()) as {
    items?: {
      title?: string;
      link?: string;
      snippet?: string;
    }[];
  };

  return data;
};
