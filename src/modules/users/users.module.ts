import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports    : [TypeOrmModule.forFeature([ User ]), AuthModule],
  controllers: [UsersController],
  providers  : [UsersService],
  exports    : [TypeOrmModule]
})
export class UsersModule {}
