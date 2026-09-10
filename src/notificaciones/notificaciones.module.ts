import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificacionesGateway } from './notificaciones.gateway.js';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET_GAMIFIED_KEY',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  providers: [NotificacionesGateway],
  exports: [NotificacionesGateway],
})
export class NotificacionesModule {}
