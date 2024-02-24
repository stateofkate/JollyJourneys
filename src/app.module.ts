// src/app.module.ts or the relevant module file
import { Module } from '@nestjs/common';
import { FireworksController } from './fireworks/fireworks.controller';
import { FireworksService } from './fireworks/fireworks.service';

@Module({
  controllers: [FireworksController],
  providers: [FireworksService],
})
export class AppModule {}
