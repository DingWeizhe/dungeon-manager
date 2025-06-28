import { Type } from 'class-transformer';
import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ZoneSettingsDto } from './create-zone.dto';

export class UpdateZoneDto {
  @IsOptional()
  @IsString()
  name?: string;

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
