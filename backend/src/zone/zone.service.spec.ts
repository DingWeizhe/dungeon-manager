import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ConnectionType,
  ZoneConnection,
} from './entities/zone-connection.entity';
import { Zone, ZoneType } from './entities/zone.entity';
import { ZoneService } from './zone.service';

describe('ZoneService', () => {
  let service: ZoneService;
  let zoneRepository: Repository<Zone>;
  let connectionRepository: Repository<ZoneConnection>;

  const mockZone = {
    id: '1',
    name: 'Test Zone',
    type: ZoneType.PUBLIC,
    description: 'Test Description',
    securityLevel: 1,
    organizationId: 'org-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    sourceConnections: [],
    targetConnections: [],
  };

  const mockConnection = {
    id: '1',
    sourceZoneId: '1',
    targetZoneId: '2',
    type: ConnectionType.DIRECT,
    status: 'active',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZoneService,
        {
          provide: getRepositoryToken(Zone),
          useValue: {
            create: jest.fn().mockReturnValue(mockZone),
            save: jest.fn().mockResolvedValue(mockZone),
            findOne: jest.fn().mockResolvedValue(mockZone),
            findAndCount: jest.fn().mockResolvedValue([[mockZone], 1]),
            remove: jest.fn().mockResolvedValue(true),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockResolvedValue([[mockZone], 1]),
            })),
          },
        },
        {
          provide: getRepositoryToken(ZoneConnection),
          useValue: {
            create: jest.fn().mockReturnValue(mockConnection),
            save: jest.fn().mockResolvedValue(mockConnection),
            findOne: jest.fn().mockResolvedValue(mockConnection),
            remove: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<ZoneService>(ZoneService);
    zoneRepository = module.get<Repository<Zone>>(getRepositoryToken(Zone));
    connectionRepository = module.get<Repository<ZoneConnection>>(
      getRepositoryToken(ZoneConnection),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new zone', async () => {
      const createZoneDto = {
        organizationId: 'org-1',
        name: 'Test Zone',
        type: ZoneType.PUBLIC,
      };

      const result = await service.create(createZoneDto);
      expect(result).toEqual(mockZone);
      expect(zoneRepository.create).toHaveBeenCalledWith(createZoneDto);
      expect(zoneRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated zones', async () => {
      const result = await service.findAll('org-1', 1, 10);
      expect(result).toEqual({
        items: [mockZone],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a zone by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockZone);
    });

    it('should throw NotFoundException if zone not found', async () => {
      jest.spyOn(zoneRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a zone', async () => {
      const updateZoneDto = {
        name: 'Updated Zone',
      };

      const result = await service.update('1', updateZoneDto);
      expect(result).toEqual(mockZone);
      expect(zoneRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a zone', async () => {
      await service.remove('1');
      expect(zoneRepository.remove).toHaveBeenCalled();
    });
  });

  describe('getRooms', () => {
    it('should return paginated rooms for a zone', async () => {
      const result = await service.getRooms('1', 1, 10);
      expect(result).toEqual({
        items: [],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
        },
      });
    });
  });

  describe('getConnections', () => {
    it('should return connections for a zone', async () => {
      const result = await service.getConnections('1');
      expect(result).toEqual([
        ...mockZone.sourceConnections,
        ...mockZone.targetConnections,
      ]);
    });
  });

  describe('createConnection', () => {
    it('should create a connection between zones', async () => {
      const result = await service.createConnection(
        '1',
        '2',
        ConnectionType.DIRECT,
      );
      expect(result).toEqual(mockConnection);
      expect(connectionRepository.create).toHaveBeenCalled();
      expect(connectionRepository.save).toHaveBeenCalled();
    });
  });

  describe('removeConnection', () => {
    it('should remove a connection', async () => {
      await service.removeConnection('1', '1');
      expect(connectionRepository.remove).toHaveBeenCalled();
    });
  });
});
