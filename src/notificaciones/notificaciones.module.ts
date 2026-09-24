import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificacionesGateway } from './notificaciones.gateway.js';
import { PushNotificationService } from './push-notification.service.js';
import { PushNotificationController } from './push-notification.controller.js';
import { PushSubscription } from './entities/push-subscription.entity.js';
import { Usuario } from '../usuarios/entities/usuario.entity.js';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([PushSubscription, Usuario]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || process.env.JWT_SECRET || 'SECRET_GAMIFIED_KEY',
        signOptions: { expiresIn: '12h' },
      }),
    }),
  ],
  controllers: [PushNotificationController],
  providers: [NotificacionesGateway, PushNotificationService],
  exports: [NotificacionesGateway, PushNotificationService],
})
export class NotificacionesModule {}
