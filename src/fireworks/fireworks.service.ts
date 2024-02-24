// src/fireworks/fireworks.service.ts
import { Injectable } from '@nestjs/common';
import { search_internet } from '../utils/search-internet'; // Adjust the import path as necessary

@Injectable()
export class FireworksService {
  async search(query: string): Promise<any> {
    return search_internet({ query });
  }
}
