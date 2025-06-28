import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  AdministratorStatus,
  AdministratorType,
} from '../entities/administrator.entity';

export class CreateAdministratorDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(AdministratorType)
  type: AdministratorType;

  @IsOptional()
  @IsEnum(AdministratorStatus)
  status?: AdministratorStatus;

  @IsOptional()
  @IsArray()
  permissions?: string[];

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}
