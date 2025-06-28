import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TreasureService } from './treasure.service';
import { CreateTreasureDto } from './dto/create-treasure.dto';
import { UpdateTreasureDto } from './dto/update-treasure.dto';

@Controller('treasure')
export class TreasureController {
  constructor(private readonly treasureService: TreasureService) {}

  @Post()
  create(@Body() createTreasureDto: CreateTreasureDto) {
    return this.treasureService.create(createTreasureDto);
  }

  @Get()
  findAll() {
    return this.treasureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.treasureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTreasureDto: UpdateTreasureDto) {
    return this.treasureService.update(+id, updateTreasureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.treasureService.remove(+id);
  }
}
