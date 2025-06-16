import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './entities/action.entity';
import { AuthModule } from '../auth/auth.module';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';

@Module({
  imports    : [TypeOrmModule.forFeature([Action]), AuthModule],
  controllers: [ActionsController],
  providers  : [ActionsService],
  exports    : [TypeOrmModule],
})
export class ActionsModule {}
