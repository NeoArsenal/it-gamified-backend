import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

interface AttemptRecord {
  timestamps: number[];
  blockedUntil?: number;
}

@Injectable()
export class LoginThrottlerGuard implements CanActivate {
  private readonly logger = new Logger('Security-RateLimiter');
  private readonly attempts = new Map<string, AttemptRecord>();

  // Configuración de límites
  private readonly WINDOW_MS = 60 * 1000; // Ventana de 1 minuto
  private readonly MAX_ATTEMPTS = 5; // Máximo 5 intentos por ventana
  private readonly BLOCK_DURATION_MS = 5 * 60 * 1000; // Si reincide, bloqueo por 5 minutos

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const clientIp = this.getClientIp(req);
    const now = Date.now();

    const record = this.attempts.get(clientIp) || { timestamps: [] };

    // 1. Verificar si la IP está en periodo de penalización / bloqueo
    if (record.blockedUntil && now < record.blockedUntil) {
      const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000);
      res.setHeader('Retry-After', remainingSeconds);
      this.logger.warn(`🛑 [BLOQUEO IP] ${clientIp} intentó acceder mientras está penalizado. Quedan ${remainingSeconds}s.`);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Demasiados intentos fallidos. Tu dirección IP ha sido temporalmente bloqueada. Intenta nuevamente en ${remainingSeconds} segundos.`,
          retryAfter: remainingSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 2. Limpiar timestamps fuera de la ventana activa
    record.timestamps = record.timestamps.filter((ts) => now - ts < this.WINDOW_MS);

    // 3. Verificar si excede el límite permitido
    if (record.timestamps.length >= this.MAX_ATTEMPTS) {
      record.blockedUntil = now + this.BLOCK_DURATION_MS;
      this.attempts.set(clientIp, record);

      const remainingSeconds = Math.ceil(this.BLOCK_DURATION_MS / 1000);
      res.setHeader('Retry-After', remainingSeconds);
      this.logger.warn(`🚨 [RATE LIMIT EXCEDIDO] IP ${clientIp} bloqueada por ${remainingSeconds}s tras ${record.timestamps.length} intentos.`);

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Has superado el límite de 5 intentos por minuto. Acceso bloqueado temporalmente por 5 minutos.`,
          retryAfter: remainingSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 4. Registrar intento actual
    record.timestamps.push(now);
    this.attempts.set(clientIp, record);

    return true;
  }

  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
}
