import { search_yelp_api } from './search-yelp-api';
import { search_reddit_on_google } from './search-reddit-on-google';

export interface FunctionCall {
  search_yelp_api: (query: string) => Promise<any[]>;
  search_reddit_on_google: (query: string) => Promise<any[]>;
}

export const functionCall: FunctionCall = {
  search_yelp_api: search_yelp_api,
  search_reddit_on_google: search_reddit_on_google,
};
