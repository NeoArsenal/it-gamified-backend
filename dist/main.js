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
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3002',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3002',
        process.env.FRONTEND_URL,
    ].filter(Boolean);
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            const isAllowed = process.env.NODE_ENV !== 'production' ||
                allowedOrigins.includes(origin) ||
                origin.endsWith('.vercel.app') ||
                origin.includes('limatambo.com.pe');
            if (isAllowed) {
                return callback(null, true);
            }
            return callback(new Error(`Acceso bloqueado por política CORS: origen "${origin}" no autorizado`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`\n🚀 Backend TI Gamificado corriendo en http://localhost:${port}/api\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map