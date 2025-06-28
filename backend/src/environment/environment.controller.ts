import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { EnvironmentService } from './environment.service';

@Controller('environments')
export class EnvironmentController {
  constructor(private readonly environmentService: EnvironmentService) {}

  @Post()
  create(@Body() createEnvironmentDto: CreateEnvironmentDto) {
    return this.environmentService.create(createEnvironmentDto);
  }

  @Get()
  findAll() {
    return this.environmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.environmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEnvironmentDto: UpdateEnvironmentDto,
  ) {
    return this.environmentService.update(id, updateEnvironmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.environmentService.remove(id);
  }
}
