var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificacionesGateway } from './notificaciones.gateway.js';
import { PushNotificationService } from './push-notification.service.js';
import { PushNotificationController } from './push-notification.controller.js';
import { PushSubscription } from './entities/push-subscription.entity.js';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
let NotificacionesModule = class NotificacionesModule {
};
NotificacionesModule = __decorate([
    Global(),
    Module({
        imports: [
            TypeOrmModule.forFeature([PushSubscription, Usuario]),
            JwtModule.registerAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET') || process.env.JWT_SECRET || 'SECRET_GAMIFIED_KEY',
                    signOptions: { expiresIn: '12h' },
                }),
            }),
        ],
        controllers: [PushNotificationController],
        providers: [NotificacionesGateway, PushNotificationService],
        exports: [NotificacionesGateway, PushNotificationService],
    })
], NotificacionesModule);
export { NotificacionesModule };
//# sourceMappingURL=notificaciones.module.js.map