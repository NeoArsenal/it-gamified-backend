import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import webpush from 'web-push';
import { PushSubscription } from './entities/push-subscription.entity.js';
import { Usuario, RolUsuario } from '../usuarios/entities/usuario.entity.js';
import { CreatePushSubscriptionDto } from './dto/push-subscription.dto.js';

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
  data?: any;
}

@Injectable()
export class PushNotificationService implements OnModuleInit {
  private readonly logger = new Logger(PushNotificationService.name);
  private vapidConfigured = false;

  constructor(
    @InjectRepository(PushSubscription)
    private readonly pushSubRepo: Repository<PushSubscription>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.initVapid();
  }

  private initVapid() {
    const publicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    const subject = this.configService.get<string>('VAPID_SUBJECT') || 'mailto:soporte@clinicalimatambo.com';

    if (publicKey && privateKey) {
      try {
        webpush.setVapidDetails(subject, publicKey, privateKey);
        this.vapidConfigured = true;
        this.logger.log('Web Push VAPID inicializado correctamente.');
      } catch (error) {
        this.logger.error('Error al configurar VAPID details:', error);
      }
    } else {
      this.logger.warn('Claves VAPID no encontradas en el entorno. Notificaciones Push deshabilitadas.');
    }
  }

  getPublicKey(): string | null {
    return this.configService.get<string>('VAPID_PUBLIC_KEY') || null;
  }

  async saveSubscription(userId: string, dto: CreatePushSubscriptionDto): Promise<PushSubscription> {
    const existing = await this.pushSubRepo.findOne({
      where: { endpoint: dto.endpoint },
    });

    if (existing) {
      existing.userId = userId;
      existing.p256dh = dto.keys.p256dh;
      existing.auth = dto.keys.auth;
      if (dto.userAgent) existing.userAgent = dto.userAgent;
      return await this.pushSubRepo.save(existing);
    }

    const sub = this.pushSubRepo.create({
      userId,
      endpoint: dto.endpoint,
      p256dh: dto.keys.p256dh,
      auth: dto.keys.auth,
      userAgent: dto.userAgent || '',
    });

    return await this.pushSubRepo.save(sub);
  }

  async removeSubscription(endpoint: string): Promise<void> {
    await this.pushSubRepo.delete({ endpoint });
  }

  async removeUserSubscriptions(userId: string): Promise<void> {
    await this.pushSubRepo.delete({ userId });
  }

  async sendToSubscription(sub: PushSubscription, payload: PushNotificationPayload): Promise<boolean> {
    if (!this.vapidConfigured) {
      this.logger.warn('Intento de envío Push sin VAPID configurado.');
      return false;
    }

    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth,
      },
    };

    const notificationData = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icon-192.png',
      badge: payload.badge || '/icon-192.png',
      tag: payload.tag || 'limatambo-helpdesk',
      data: {
        url: payload.url || '/',
        ...payload.data,
      },
    });

    try {
      await webpush.sendNotification(pushSubscription, notificationData);
      return true;
    } catch (error: any) {
      // Si el endpoint expiró o fue desuscrito por el usuario en el navegador (410 o 404), limpiamos la DB
      if (error?.statusCode === 410 || error?.statusCode === 404) {
        this.logger.warn(`Suscripción Push expirada (${error.statusCode}). Eliminando endpoint: ${sub.endpoint.slice(0, 35)}...`);
        await this.pushSubRepo.delete({ id: sub.id });
      } else {
        this.logger.error(`Error enviando Web Push a ${sub.endpoint.slice(0, 35)}...:`, error?.message || error);
      }
      return false;
    }
  }

  async sendToUser(userId: string, payload: PushNotificationPayload): Promise<void> {
    const subscriptions = await this.pushSubRepo.find({ where: { userId } });
    if (!subscriptions.length) return;

    await Promise.allSettled(
      subscriptions.map((sub) => this.sendToSubscription(sub, payload))
    );
  }

  async sendToRoles(roles: RolUsuario[], payload: PushNotificationPayload): Promise<void> {
    const users = await this.usuarioRepo.find({
      where: { rol: In(roles) },
      select: { id: true },
    });

    if (!users.length) return;
    const userIds = users.map((u) => u.id);

    const subscriptions = await this.pushSubRepo.find({
      where: { userId: In(userIds) },
    });

    if (!subscriptions.length) return;

    this.logger.log(`Enviando Web Push a ${subscriptions.length} dispositivo(s) suscritos.`);
    await Promise.allSettled(
      subscriptions.map((sub) => this.sendToSubscription(sub, payload))
    );
  }

  async sendNewTicketAlert(ticket: any): Promise<void> {
    const ticketNum = ticket.numeroTicket || (ticket.id ? String(ticket.id).slice(0, 6).toUpperCase() : '');
    const title = `🎫 Nuevo Ticket #${ticketNum}`;
    const sede = ticket.sede ? `Sede: ${ticket.sede}` : '';
    const area = ticket.area ? `Área: ${ticket.area}` : '';
    const ubicacion = [sede, area].filter(Boolean).join(' | ');

    const body = `${ticket.titulo}${ubicacion ? `\n📍 ${ubicacion}` : ''}`;

    await this.sendToRoles([RolUsuario.ADMIN, RolUsuario.TECNICO], {
      title,
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      url: `/?view=tickets&ticketId=${ticket.id}`,
      tag: `ticket-${ticket.id}`,
      data: { ticketId: ticket.id },
    });
  }
}
