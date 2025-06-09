import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { Role } from './entities/role.entity';
// Modules
import { AuthModule } from '../auth/auth.module';
// Services
import { RolesService } from './roles.service';
// Controllers
import { RolesController } from './roles.controller';

@Module({
  imports    : [TypeOrmModule.forFeature([Role]), AuthModule],
  controllers: [RolesController],
  providers  : [RolesService],
  exports    : [TypeOrmModule],
})
export class RolesModule {}
