import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

let isRunning = false;
async function bootstrap() {
  if (isRunning) return;
  isRunning = true;
  const app = await NestFactory.create(AppModule);

  // Prefijo global: todas las rutas empiezan con /api
  app.setGlobalPrefix('api');

  // CORS para que el Frontend (Next.js en :3000, 3002, etc) pueda conectarse
  app.enableCors({ origin: true, credentials: true });

  // Validación automática de DTOs con class-validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`\n🚀 Backend TI Gamificado corriendo en http://localhost:${port}/api\n`);
}
bootstrap();
