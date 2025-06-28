import { Injectable } from '@nestjs/common';
import { CreateTreasureDto } from './dto/create-treasure.dto';
import { UpdateTreasureDto } from './dto/update-treasure.dto';

@Injectable()
export class TreasureService {
  create(createTreasureDto: CreateTreasureDto) {
    return 'This action adds a new treasure';
  }

  findAll() {
    return `This action returns all treasure`;
  }

  findOne(id: number) {
    return `This action returns a #${id} treasure`;
  }

  update(id: number, updateTreasureDto: UpdateTreasureDto) {
    return `This action updates a #${id} treasure`;
  }

  remove(id: number) {
    return `This action removes a #${id} treasure`;
  }
}
