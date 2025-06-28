import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministratorController } from './administrator.controller';
import { AdministratorService } from './administrator.service';
import { Administrator } from './entities/administrator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Administrator])],
  controllers: [AdministratorController],
  providers: [AdministratorService],
  exports: [AdministratorService],
})
export class AdministratorModule {}
