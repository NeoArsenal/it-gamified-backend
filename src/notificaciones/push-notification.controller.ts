import { Controller, Get, Post, Body, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service.js';
import { CreatePushSubscriptionDto, UnsubscribePushDto } from './dto/push-subscription.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('notifications/push')
export class PushNotificationController {
  constructor(private readonly pushService: PushNotificationService) {}

  @Get('public-key')
  getPublicKey() {
    const key = this.pushService.getPublicKey();
    if (!key) {
      throw new BadRequestException('Las claves VAPID no están configuradas en el servidor');
    }
    return { publicKey: key };
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribe(@Req() req: any, @Body() dto: CreatePushSubscriptionDto) {
    const userId = req.user.id;
    const sub = await this.pushService.saveSubscription(userId, dto);
    return { success: true, id: sub.id };
  }

  @UseGuards(JwtAuthGuard)
  @Post('unsubscribe')
  async unsubscribe(@Body() dto: UnsubscribePushDto) {
    await this.pushService.removeSubscription(dto.endpoint);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  async testNotification(@Req() req: any) {
    const userId = req.user.id;
    await this.pushService.sendToUser(userId, {
      title: '🔔 Notificación de Prueba',
      body: '¡Excelente! Tu celular está listo para recibir alertas en tiempo real de Helpdesk Limatambo.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'test-notification',
      url: '/?view=tickets',
    });
    return { success: true, message: 'Alerta de prueba enviada' };
  }
}
