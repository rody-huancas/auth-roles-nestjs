import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SystemModule } from './entities/system-module.entity';
import { SystemModulesService } from './system-modules.service';
import { SystemModulesController } from './system-modules.controller';

@Module({
  imports    : [TypeOrmModule.forFeature([SystemModule]), AuthModule],
  controllers: [SystemModulesController],
  providers  : [SystemModulesService],
  exports    : [TypeOrmModule],
})
export class SystemModulesModule {}
