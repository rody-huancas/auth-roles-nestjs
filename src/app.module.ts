import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
// Config
import { typeOrmConfig } from './config/database/typeorm.config';
// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { SystemModulesModule } from './modules/system-modules/system-modules.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
      inject    : [ConfigService]
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    SystemModulesModule,
  ],
})
export class AppModule {}
