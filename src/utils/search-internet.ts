import { Fireworks } from '@langchain/community/llms/fireworks';
import { yelpSearch } from './yelp-search'; // Ensure you have the yelp-search.js setup
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// Yelp search integration
const yelp = async (category, location) => {
  const yelpResponse = await yelpSearch(category, location);
  const yelpItems = yelpResponse?.businesses || [];
  return {
    items: yelpItems.map(
      (business) =>
        `${business.name}: ${business.categories.map((cat) => cat.title).join(', ')} located at ${business.location.address1}, ${business.location.city}.`,
    ),
    links: yelpItems.map((business) => business.url),
  };
};

const tool = async (query) => {
  // Assuming query is structured as "category:location"
  const [category, location] = query.split(':');
  return await yelp(category, location);
};

const outputParser = new StringOutputParser();

const mistralModel = new Fireworks({
  modelName: 'accounts/fireworks/models/mistral-8x7b-instruct',
  streaming: false,
});

export const search_internet = async ({ query }: { query: string }) => {
  const { items, links } = await tool(query);

  if (items.length === 0) {
    const response =
      "I couldn't find any results for your query. Please try a different search.";
    return { response, links: [] as string[] };
  }

  const prompt =
    PromptTemplate.fromTemplate(`Here are the top results for your search. I've gathered information on the best ${query.split(':')[0]} options in ${query.split(':')[1]}. Use this information to provide a helpful summary.

  --------
  ${items.join('\n')}
  ---------

  Please provide a summary based on these top results:`);

  const chain = prompt.pipe(mistralModel).pipe(outputParser);

  const response = await chain.invoke({
    items: items.join('\n'),
    query: query,
  });

  return {
    response: response,
    links: links,
  };
};
