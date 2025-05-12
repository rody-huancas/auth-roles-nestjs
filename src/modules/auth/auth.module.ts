import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { JwtConfig } from 'src/config/jwt/jwt.config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports : [ConfigModule],
      inject  : [ConfigService],
      useClass: JwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers  : [AuthService, JwtStrategy],
  exports    : [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
