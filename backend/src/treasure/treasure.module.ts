import { Module } from '@nestjs/common';
import { TreasureService } from './treasure.service';
import { TreasureController } from './treasure.controller';

@Module({
  controllers: [TreasureController],
  providers: [TreasureService],
})
export class TreasureModule {}
