import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { EnvironmentType } from '../entities/environment.entity';

export class CreateEnvironmentDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(EnvironmentType)
  type: EnvironmentType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  securityLevel?: number;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}
