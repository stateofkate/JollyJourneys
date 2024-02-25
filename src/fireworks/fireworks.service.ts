// src/fireworks/fireworks.service.ts
import { Injectable } from '@nestjs/common';
import { generate } from '../utils/yelp-model/fireworks'; // Adjust the import path as necessary

@Injectable()
export class FireworksService {
  async search(query: string): Promise<any> {
    return generate(query);
  }
}
