import { search_yelp_api } from './search-yelp-api';

export interface FunctionCall {
  search_yelp_api: (query: string) => Promise<any[]>;
}

export const functionCall: FunctionCall = {
  search_yelp_api: search_yelp_api,
};
