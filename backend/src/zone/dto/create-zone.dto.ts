import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ZoneType } from '../entities/zone.entity';

export class ZoneSettingsDto {
  @IsOptional()
  @IsString({ each: true })
  allowedIPs?: string[];

  @IsOptional()
  @IsInt()
  maxConnections?: number;

  @IsOptional()
  monitoringEnabled?: boolean;
}

export class CreateZoneDto {
  @IsUUID()
  organizationId: string;

  @IsString()
  name: string;

  @IsEnum(ZoneType)
  type: ZoneType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  securityLevel?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ZoneSettingsDto)
  settings?: ZoneSettingsDto;
}
