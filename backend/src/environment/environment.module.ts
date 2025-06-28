import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentConnection } from './entities/environment-connection.entity';
import { Environment } from './entities/environment.entity';
import { EnvironmentController } from './environment.controller';
import { EnvironmentService } from './environment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Environment, EnvironmentConnection])],
  controllers: [EnvironmentController],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
