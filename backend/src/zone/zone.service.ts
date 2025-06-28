import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import {
  ConnectionType,
  ZoneConnection,
} from './entities/zone-connection.entity';
import { Zone } from './entities/zone.entity';

@Injectable()
export class ZoneService {
  constructor(
    @InjectRepository(Zone)
    private readonly zoneRepository: Repository<Zone>,
    @InjectRepository(ZoneConnection)
    private readonly connectionRepository: Repository<ZoneConnection>,
  ) {}

  async create(createZoneDto: CreateZoneDto): Promise<Zone> {
    const zone = this.zoneRepository.create(createZoneDto);
    return this.zoneRepository.save(zone);
  }

  async findAll(organizationId: string, page = 1, limit = 10) {
    const [items, total] = await this.zoneRepository.findAndCount({
      where: { organizationId },
      relations: ['rooms'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async findOne(id: string): Promise<Zone> {
    const zone = await this.zoneRepository.findOne({
      where: { id },
      relations: ['rooms', 'sourceConnections', 'targetConnections'],
    });

    if (!zone) {
      throw new NotFoundException(`Zone with ID ${id} not found`);
    }

    return zone;
  }

  async update(id: string, updateZoneDto: UpdateZoneDto): Promise<Zone> {
    const zone = await this.findOne(id);
    Object.assign(zone, updateZoneDto);
    return this.zoneRepository.save(zone);
  }

  async remove(id: string): Promise<void> {
    const zone = await this.findOne(id);
    await this.zoneRepository.remove(zone);
  }

  async getRooms(id: string, page = 1, limit = 10) {
    const zone = await this.zoneRepository.findOne({
      where: { id },
      relations: ['rooms'],
    });

    if (!zone) {
      throw new NotFoundException(`Zone with ID ${id} not found`);
    }

    const [items, total] = await this.zoneRepository
      .createQueryBuilder('zone')
      .leftJoinAndSelect('zone.rooms', 'room')
      .where('zone.id = :id', { id })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items: items[0]?.rooms || [],
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async getConnections(id: string): Promise<ZoneConnection[]> {
    const zone = await this.zoneRepository.findOne({
      where: { id },
      relations: ['sourceConnections', 'targetConnections'],
    });

    if (!zone) {
      throw new NotFoundException(`Zone with ID ${id} not found`);
    }

    return [...zone.sourceConnections, ...zone.targetConnections];
  }

  async createConnection(
    id: string,
    targetZoneId: string,
    type: ConnectionType,
    settings?: {
      maxBandwidth?: number;
      encryption?: boolean;
      allowedProtocols?: string[];
    },
  ): Promise<ZoneConnection> {
    const sourceZone = await this.findOne(id);
    const targetZone = await this.findOne(targetZoneId);

    const connection = this.connectionRepository.create({
      sourceZoneId: id,
      targetZoneId,
      type,
      settings,
    });

    return this.connectionRepository.save(connection);
  }

  async removeConnection(id: string, connectionId: string): Promise<void> {
    const connection = await this.connectionRepository.findOne({
      where: { id: connectionId, sourceZoneId: id },
    });

    if (!connection) {
      throw new NotFoundException(
        `Connection with ID ${connectionId} not found`,
      );
    }

    await this.connectionRepository.remove(connection);
  }
}
