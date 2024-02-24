import { OpenAI } from 'openai';
import { FunctionCall, functionCall } from './function-call';

export const fireworks = new OpenAI({
  apiKey: process.env.FIREWORKS_API_KEY!,
  baseURL: 'https://api.fireworks.ai/inference/v1',
});
export const generate = async (query: string) => {
  const chat = await fireworks.chat.completions.create({
    model: 'accounts/fireworks/models/firefunction-v1',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant information researcher and aggregator who can search information and format data using functions. Current year is 2024 and Your Knowledge cut off is 2021.',
      },
      { role: 'user', content: query },
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'search_yelp',
          description:
            'Search for information about a location using the Yelp API',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'A location to search for information about',
              },
              category: {
                type: 'string',
                description: 'A category to search for',
              },
            },
            required: ['location', 'category'],
          },
        },
      },
    ],
  });

  const choice = chat.choices[0];

  const finish_reason = choice.finish_reason;

  if (finish_reason === 'tool_calls') {
    if (!choice?.message?.tool_calls) {
      return {
        response:
          'there was an error processing your request, please try again later.',
        links: [],
      };
    }
    const toolInfo = choice?.message?.tool_calls[0];
    const name = toolInfo?.function?.name as keyof FunctionCall;
    return await functionCall[name](JSON.parse(toolInfo?.function?.arguments));
  } else {
    const response = choice.message.content;
    return {
      response: response,
      links: [],
    };
  }
};
