// src/fireworks/fireworks.controller.ts
import { Controller, Get, Query, Res } from '@nestjs/common';
import { FireworksService } from './fireworks.service';
import { Response } from 'express';

@Controller('fireworks')
export class FireworksController {
  constructor(private readonly fireworksService: FireworksService) {}

  @Get('search')
  async getSearchResults(@Query('query') query: string, @Res() res: Response) {
    if (!query) {
      return res.status(400).send({ message: 'Query parameter is required.' });
    }
    try {
      const result = await this.fireworksService.search(query);
      res.json(result);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: 'An error occurred while processing your request.' });
    }
  }
}
