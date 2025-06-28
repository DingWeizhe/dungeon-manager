import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from '../../service/entities/service.entity';

export enum AdministratorType {
  SYSTEM = 'system',
  SECURITY = 'security',
  NETWORK = 'network',
  DATABASE = 'database',
  APPLICATION = 'application',
}

export enum AdministratorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

@Entity()
export class Administrator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: AdministratorType,
    default: AdministratorType.SYSTEM,
  })
  type: AdministratorType;

  @Column({
    type: 'enum',
    enum: AdministratorStatus,
    default: AdministratorStatus.ACTIVE,
  })
  status: AdministratorStatus;

  @Column({ type: 'jsonb', nullable: true })
  permissions: string[];

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Service, (service) => service.administrators)
  service: Service;
}
