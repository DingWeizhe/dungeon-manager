import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from '../../organization/entities/organization.entity';
import { Room } from '../../room/entities/room.entity';
import { ZoneConnection } from './zone-connection.entity';

export enum ZoneType {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONTAINER = 'container',
  EXTERNAL = 'external',
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  PRODUCTION = 'production',
}

@Entity('zones')
export class Zone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ZoneType,
  })
  type: ZoneType;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', default: 1 })
  securityLevel: number;

  @Column({ type: 'jsonb', nullable: true })
  settings: {
    allowedIPs?: string[];
    maxConnections?: number;
    monitoringEnabled?: boolean;
  };

  @Column('uuid')
  organizationId: string;

  @ManyToOne(() => Organization, (organization) => organization.zones)
  organization: Organization;

  @OneToMany(() => Room, (room) => room.zone)
  rooms: Room[];

  @OneToMany(() => ZoneConnection, (connection) => connection.sourceZone)
  sourceConnections: ZoneConnection[];

  @OneToMany(() => ZoneConnection, (connection) => connection.targetZone)
  targetConnections: ZoneConnection[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
