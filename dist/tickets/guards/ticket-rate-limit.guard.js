var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TicketRateLimitGuard_1;
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
let TicketRateLimitGuard = TicketRateLimitGuard_1 = class TicketRateLimitGuard {
    logger = new Logger(TicketRateLimitGuard_1.name);
    ipRequests = new Map();
    MAX_REQUESTS = 30;
    WINDOW_MS = 60 * 1000;
    constructor() {
        setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const forwarded = req.headers['x-forwarded-for'];
        const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress) || req.ip || 'desconocida';
        const now = Date.now();
        const windowStart = now - this.WINDOW_MS;
        const record = this.ipRequests.get(ip) || { timestamps: [] };
        const recentRequests = record.timestamps.filter(ts => ts > windowStart);
        if (recentRequests.length >= this.MAX_REQUESTS) {
            const oldestInWindow = recentRequests[0];
            const secondsLeft = Math.ceil((oldestInWindow + this.WINDOW_MS - now) / 1000);
            this.logger.warn(`🛑 Rate limit excedido para IP ${ip} (${recentRequests.length} peticiones). Espera ${secondsLeft}s`);
            throw new HttpException({
                statusCode: HttpStatus.TOO_MANY_REQUESTS,
                message: `Has excedido el límite de solicitudes. Por favor espera ${secondsLeft} segundos antes de enviar otro ticket.`,
                retryAfter: secondsLeft,
            }, HttpStatus.TOO_MANY_REQUESTS);
        }
        recentRequests.push(now);
        this.ipRequests.set(ip, { timestamps: recentRequests });
        return true;
    }
    cleanup() {
        const now = Date.now();
        const windowStart = now - this.WINDOW_MS;
        for (const [ip, record] of this.ipRequests.entries()) {
            const valid = record.timestamps.filter(ts => ts > windowStart);
            if (valid.length === 0) {
                this.ipRequests.delete(ip);
            }
            else {
                this.ipRequests.set(ip, { timestamps: valid });
            }
        }
    }
};
TicketRateLimitGuard = TicketRateLimitGuard_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], TicketRateLimitGuard);
export { TicketRateLimitGuard };
//# sourceMappingURL=ticket-rate-limit.guard.js.map