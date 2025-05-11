import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
// Module
import { AppModule } from './app.module';
// Config
import { setupSwagger } from './config/swagger/swagger.config';

async function bootstrap() {
  const app           = await NestFactory.create(AppModule);
  const logger        = new Logger('Bootstrap');
  const configService = app.get(ConfigService);
  const PORT          = configService.get('PORT') || 3000;

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
  );
  
  app.enableCors();

  setupSwagger(app);

  await app.listen(PORT, () => {
    logger.log(`[INFO] El servidor se ha iniciado en http://localhost:${PORT}`);
    logger.log(`[INFO] Documentación de Swagger: http://localhost:${PORT}/swagger/api`);
  });
}
bootstrap();
