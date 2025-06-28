import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from '../../service/entities/service.entity';

export enum CredentialType {
  PASSWORD = 'password',
  API_KEY = 'api_key',
  CERTIFICATE = 'certificate',
  SSH_KEY = 'ssh_key',
  TOKEN = 'token',
}

export enum CredentialStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

@Entity()
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CredentialType,
    default: CredentialType.PASSWORD,
  })
  type: CredentialType;

  @Column({
    type: 'enum',
    enum: CredentialStatus,
    default: CredentialStatus.ACTIVE,
  })
  status: CredentialStatus;

  @Column({ type: 'text', nullable: true })
  username: string;

  @Column({ type: 'text' })
  encryptedValue: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Service, (service) => service.credentials)
  service: Service;
}
