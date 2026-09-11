import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
let isRunning = false;
async function bootstrap() {
    if (isRunning)
        return;
    isRunning = true;
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({ origin: true, credentials: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`\n🚀 Backend TI Gamificado corriendo en http://localhost:${port}/api\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map