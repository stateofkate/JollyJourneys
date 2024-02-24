import { search_internet } from './search-internet';

export interface FunctionCall {
  search_internet: ({
    query,
    noSearch,
  }: {
    query: string;
    noSearch?: boolean;
  }) => any;
}

export const functionCall: FunctionCall = {
  search_internet: search_internet,
};
