import { OpenAI } from 'openai';
import { FunctionCall, functionCall } from './function-call';

export const fireworks = new OpenAI({
  apiKey: 't9K22AAfmjHKGGvEZAicgQPGKGAjQhD9lKXGjPZqiVSQsJ1p',
  baseURL: 'https://api.fireworks.ai/inference/v1',
});
export const generate = async (query: string) => {
  const chat = await fireworks.chat.completions.create({
    model: 'accounts/fireworks/models/firefunction-v1',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant information researcher and aggregator who can search information via Yelp and Google, and format data using functions. Current year is 2024 and Your Knowledge cut off is 2021.',
      },
      { role: 'user', content: query },
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'search_reddit_on_google',
          description:
            'Searches for reddit.com pages using the google search API, returns a reddit URL.',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'A category and a location.',
              },
            },
            required: ['query'],
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
