import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Permission } from './entities/permission.entity';
import { ActionsModule } from '../actions/actions.module';
import { PermissionsService } from './permissions.service';
import { SystemModulesModule } from '../system-modules/system-modules.module';
import { PermissionsController } from './permissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    AuthModule,
    ActionsModule,
    SystemModulesModule,
  ],
  controllers: [PermissionsController],
  providers  : [PermissionsService],
  exports    : [TypeOrmModule],
})
export class PermissionsModule {}
