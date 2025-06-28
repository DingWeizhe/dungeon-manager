import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Zone } from './zone.entity';

export enum ConnectionType {
  DIRECT = 'direct',
  GATEWAY = 'gateway',
  TUNNEL = 'tunnel',
}

export enum ConnectionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

@Entity('zone_connections')
export class ZoneConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  sourceZoneId: string;

  @Column('uuid')
  targetZoneId: string;

  @Column({
    type: 'enum',
    enum: ConnectionType,
  })
  type: ConnectionType;

  @Column({
    type: 'enum',
    enum: ConnectionStatus,
    default: ConnectionStatus.ACTIVE,
  })
  status: ConnectionStatus;

  @Column({ type: 'jsonb', nullable: true })
  settings: {
    maxBandwidth?: number;
    encryption?: boolean;
    allowedProtocols?: string[];
  };

  @ManyToOne(() => Zone, (zone) => zone.sourceConnections)
  @JoinColumn({ name: 'sourceZoneId' })
  sourceZone: Zone;

  @ManyToOne(() => Zone, (zone) => zone.targetConnections)
  @JoinColumn({ name: 'targetZoneId' })
  targetZone: Zone;

  @CreateDateColumn()
  createdAt: Date;
}
