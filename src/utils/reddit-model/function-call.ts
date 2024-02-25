import { search_reddit_on_google } from './search-reddit-on-google';

export interface FunctionCall {
  search_reddit_on_google: (query: string) => Promise<any[]>;
}

export const functionCall: FunctionCall = {
  search_reddit_on_google: search_reddit_on_google,
};
