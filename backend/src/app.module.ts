import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministratorModule } from './administrator/administrator.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CredentialModule } from './credential/credential.module';
import { EnvironmentModule } from './environment/environment.module';
import { I18nModule } from './i18n/i18n.module';
import { OrganizationModule } from './organization/organization.module';
import { ServiceModule } from './service/service.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [
    // 配置模組
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // TypeORM 配置
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'system_manager'),
        schema: configService.get('DB_SCHEMA', 'public'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // 功能模組
    AuthModule,
    OrganizationModule,
    EnvironmentModule,
    ServiceModule,
    AdministratorModule,
    CredentialModule,
    TeamModule,
    I18nModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
