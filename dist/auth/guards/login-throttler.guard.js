var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
let LoginThrottlerGuard = class LoginThrottlerGuard {
    logger = new Logger('Security-RateLimiter');
    attempts = new Map();
    WINDOW_MS = 60 * 1000;
    MAX_ATTEMPTS = 5;
    BLOCK_DURATION_MS = 5 * 60 * 1000;
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const clientIp = this.getClientIp(req);
        const now = Date.now();
        const record = this.attempts.get(clientIp) || { timestamps: [] };
        if (record.blockedUntil && now < record.blockedUntil) {
            const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000);
            res.setHeader('Retry-After', remainingSeconds);
            this.logger.warn(`🛑 [BLOQUEO IP] ${clientIp} intentó acceder mientras está penalizado. Quedan ${remainingSeconds}s.`);
            throw new HttpException({
                statusCode: HttpStatus.TOO_MANY_REQUESTS,
                message: `Demasiados intentos fallidos. Tu dirección IP ha sido temporalmente bloqueada. Intenta nuevamente en ${remainingSeconds} segundos.`,
                retryAfter: remainingSeconds,
            }, HttpStatus.TOO_MANY_REQUESTS);
        }
        record.timestamps = record.timestamps.filter((ts) => now - ts < this.WINDOW_MS);
        if (record.timestamps.length >= this.MAX_ATTEMPTS) {
            record.blockedUntil = now + this.BLOCK_DURATION_MS;
            this.attempts.set(clientIp, record);
            const remainingSeconds = Math.ceil(this.BLOCK_DURATION_MS / 1000);
            res.setHeader('Retry-After', remainingSeconds);
            this.logger.warn(`🚨 [RATE LIMIT EXCEDIDO] IP ${clientIp} bloqueada por ${remainingSeconds}s tras ${record.timestamps.length} intentos.`);
            throw new HttpException({
                statusCode: HttpStatus.TOO_MANY_REQUESTS,
                message: `Has superado el límite de 5 intentos por minuto. Acceso bloqueado temporalmente por 5 minutos.`,
                retryAfter: remainingSeconds,
            }, HttpStatus.TOO_MANY_REQUESTS);
        }
        record.timestamps.push(now);
        this.attempts.set(clientIp, record);
        return true;
    }
    getClientIp(req) {
        const forwarded = req.headers['x-forwarded-for'];
        if (typeof forwarded === 'string') {
            return forwarded.split(',')[0].trim();
        }
        return req.ip || req.socket.remoteAddress || 'unknown';
    }
};
LoginThrottlerGuard = __decorate([
    Injectable()
], LoginThrottlerGuard);
export { LoginThrottlerGuard };
//# sourceMappingURL=login-throttler.guard.js.map