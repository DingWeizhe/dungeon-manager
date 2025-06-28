import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { ConnectionType } from './entities/zone-connection.entity';
import { ZoneService } from './zone.service';

@Controller('zones')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Post()
  create(@Body() createZoneDto: CreateZoneDto) {
    return this.zoneService.create(createZoneDto);
  }

  @Get()
  findAll(
    @Query('organizationId', ParseUUIDPipe) organizationId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.zoneService.findAll(organizationId, page, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.zoneService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateZoneDto: UpdateZoneDto,
  ) {
    return this.zoneService.update(id, updateZoneDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.zoneService.remove(id);
  }

  @Get(':id/rooms')
  getRooms(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.zoneService.getRooms(id, page, limit);
  }

  @Get(':id/connections')
  getConnections(@Param('id', ParseUUIDPipe) id: string) {
    return this.zoneService.getConnections(id);
  }

  @Post(':id/connections')
  createConnection(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('targetZoneId', ParseUUIDPipe) targetZoneId: string,
    @Body('type') type: ConnectionType,
    @Body('settings')
    settings?: {
      maxBandwidth?: number;
      encryption?: boolean;
      allowedProtocols?: string[];
    },
  ) {
    return this.zoneService.createConnection(id, targetZoneId, type, settings);
  }

  @Delete(':id/connections/:connectionId')
  removeConnection(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('connectionId', ParseUUIDPipe) connectionId: string,
  ) {
    return this.zoneService.removeConnection(id, connectionId);
  }
}
