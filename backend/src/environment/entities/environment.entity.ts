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
import { Service } from '../../service/entities/service.entity';
import { EnvironmentConnection } from './environment-connection.entity';

export enum EnvironmentType {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONTAINER = 'container',
  EXTERNAL = 'external',
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  PRODUCTION = 'production',
}

@Entity()
export class Environment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: EnvironmentType,
    default: EnvironmentType.DEVELOPMENT,
  })
  type: EnvironmentType;

  @Column({ type: 'int', default: 1 })
  securityLevel: number;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.environments)
  organization: Organization;

  @OneToMany(() => Service, (service) => service.environment)
  services: Service[];

  @OneToMany(
    () => EnvironmentConnection,
    (connection) => connection.sourceEnvironment,
  )
  outgoingConnections: EnvironmentConnection[];

  @OneToMany(
    () => EnvironmentConnection,
    (connection) => connection.targetEnvironment,
  )
  incomingConnections: EnvironmentConnection[];
}
