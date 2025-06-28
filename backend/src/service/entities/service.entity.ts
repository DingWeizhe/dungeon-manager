import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Administrator } from '../../administrator/entities/administrator.entity';
import { Credential } from '../../credential/entities/credential.entity';
import { Environment } from '../../environment/entities/environment.entity';

export enum ServiceType {
  SERVER = 'server',
  DATABASE = 'database',
  APPLICATION = 'application',
  NETWORK = 'network',
  STORAGE = 'storage',
  SECURITY = 'security',
}

export enum ServiceStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  OFFLINE = 'offline',
}

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ServiceType,
    default: ServiceType.APPLICATION,
  })
  type: ServiceType;

  @Column({
    type: 'enum',
    enum: ServiceStatus,
    default: ServiceStatus.ACTIVE,
  })
  status: ServiceStatus;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Environment, (environment) => environment.services)
  environment: Environment;

  @OneToMany(() => Administrator, (administrator) => administrator.service)
  administrators: Administrator[];

  @OneToMany(() => Credential, (credential) => credential.service)
  credentials: Credential[];
}
