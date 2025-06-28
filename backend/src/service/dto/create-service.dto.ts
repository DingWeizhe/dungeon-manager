import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { ServiceStatus, ServiceType } from '../entities/service.entity';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ServiceType)
  type: ServiceType;

  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}
