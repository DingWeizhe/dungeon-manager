import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @IsOptional()
  @IsArray()
  memberIds?: string[];

  @IsOptional()
  @IsArray()
  sharedCredentialIds?: string[];
}
