import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Environment } from './environment.entity';

export enum ConnectionType {
  NETWORK = 'network',
  DATABASE = 'database',
  API = 'api',
  MESSAGE_QUEUE = 'message_queue',
}

@Entity()
export class EnvironmentConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ConnectionType,
    default: ConnectionType.NETWORK,
  })
  type: ConnectionType;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => Environment,
    (environment) => environment.outgoingConnections,
  )
  sourceEnvironment: Environment;

  @ManyToOne(
    () => Environment,
    (environment) => environment.incomingConnections,
  )
  targetEnvironment: Environment;
}
