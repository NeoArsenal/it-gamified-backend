import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Logger } from '@nestjs/common';

interface RateLimitRecord {
  timestamps: number[];
}

@Injectable()
export class TicketRateLimitGuard implements CanActivate {
  private readonly logger = new Logger(TicketRateLimitGuard.name);
  
  // Memoria en caché de IPs y tiempos de solicitud
  private readonly ipRequests = new Map<string, RateLimitRecord>();

  // Configuración: Máximo 30 tickets por ventana de 60 segundos por IP (adecuado para redes hospitalarias/NAT compartidas)
  private readonly MAX_REQUESTS = 30;
  private readonly WINDOW_MS = 60 * 1000; // 60 segundos

  constructor() {
    // Limpieza periódica de registros viejos cada 5 minutos
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    
    // Obtener la IP real considerando proxies (Render, Cloudflare, etc.)
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress) || req.ip || 'desconocida';

    const now = Date.now();
    const windowStart = now - this.WINDOW_MS;

    const record = this.ipRequests.get(ip) || { timestamps: [] };

    // Filtrar solicitudes anteriores a la ventana actual de 60 segundos
    const recentRequests = record.timestamps.filter(ts => ts > windowStart);

    if (recentRequests.length >= this.MAX_REQUESTS) {
      const oldestInWindow = recentRequests[0];
      const secondsLeft = Math.ceil((oldestInWindow + this.WINDOW_MS - now) / 1000);
      
      this.logger.warn(`🛑 Rate limit excedido para IP ${ip} (${recentRequests.length} peticiones). Espera ${secondsLeft}s`);
      
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Has excedido el límite de solicitudes. Por favor espera ${secondsLeft} segundos antes de enviar otro ticket.`,
          retryAfter: secondsLeft,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    // Registrar la solicitud actual
    recentRequests.push(now);
    this.ipRequests.set(ip, { timestamps: recentRequests });

    return true;
  }

  private cleanup() {
    const now = Date.now();
    const windowStart = now - this.WINDOW_MS;

    for (const [ip, record] of this.ipRequests.entries()) {
      const valid = record.timestamps.filter(ts => ts > windowStart);
      if (valid.length === 0) {
        this.ipRequests.delete(ip);
      } else {
        this.ipRequests.set(ip, { timestamps: valid });
      }
    }
  }
}
