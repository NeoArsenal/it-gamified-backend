import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Logger } from '@nestjs/common';

interface RateLimitRecord {
  timestamps: number[];
}

@Injectable()
export class PinRateLimitGuard implements CanActivate {
  private readonly logger = new Logger(PinRateLimitGuard.name);

  // Memoria en caché de IPs y tiempos de intento de validación de PIN
  private readonly ipAttempts = new Map<string, RateLimitRecord>();

  // Configuración estricta anti-fuerza bruta: Máximo 5 intentos por ventana de 60 segundos por IP
  private readonly MAX_ATTEMPTS = 5;
  private readonly WINDOW_MS = 60 * 1000; // 60 segundos

  constructor() {
    // Limpieza periódica de registros cada 5 minutos
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    // Obtener la IP real considerando proxies (Cloudflare, Render, etc.)
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress) || req.ip || 'desconocida';

    const now = Date.now();
    const windowStart = now - this.WINDOW_MS;

    const record = this.ipAttempts.get(ip) || { timestamps: [] };

    // Filtrar solicitudes anteriores a la ventana de 60s
    const recentAttempts = record.timestamps.filter((ts) => ts > windowStart);

    if (recentAttempts.length >= this.MAX_ATTEMPTS) {
      const oldestInWindow = recentAttempts[0];
      const secondsLeft = Math.ceil((oldestInWindow + this.WINDOW_MS - now) / 1000);

      this.logger.warn(`🛑 Bloqueo anti-fuerza bruta para IP ${ip} (${recentAttempts.length} intentos de PIN). Espera ${secondsLeft}s`);

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Demasiados intentos de verificación de PIN. Por seguridad, espera ${secondsLeft} segundos antes de volver a intentar.`,
          retryAfter: secondsLeft,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    // Registrar el intento actual
    recentAttempts.push(now);
    this.ipAttempts.set(ip, { timestamps: recentAttempts });

    return true;
  }

  private cleanup() {
    const threshold = Date.now() - this.WINDOW_MS;
    for (const [ip, record] of this.ipAttempts.entries()) {
      const active = record.timestamps.filter((ts) => ts > threshold);
      if (active.length === 0) {
        this.ipAttempts.delete(ip);
      } else {
        this.ipAttempts.set(ip, { timestamps: active });
      }
    }
  }
}
