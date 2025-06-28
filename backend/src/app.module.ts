import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { ZoneModule } from './zone/zone.module';
import { RoomModule } from './room/room.module';
import { GuardianModule } from './guardian/guardian.module';
import { TreasureModule } from './treasure/treasure.module';
import { PartyModule } from './party/party.module';
import { I18nModule } from './i18n/i18n.module';

@Module({
  imports: [AuthModule, OrganizationModule, ZoneModule, RoomModule, GuardianModule, TreasureModule, PartyModule, I18nModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
