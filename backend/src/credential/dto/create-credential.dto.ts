import {
  IsDate,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  CredentialStatus,
  CredentialType,
} from '../entities/credential.entity';

export class CreateCredentialDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(CredentialType)
  type: CredentialType;

  @IsOptional()
  @IsEnum(CredentialStatus)
  status?: CredentialStatus;

  @IsOptional()
  @IsString()
  username?: string;

  @IsString()
  encryptedValue: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsDate()
  expiresAt?: Date;
}
