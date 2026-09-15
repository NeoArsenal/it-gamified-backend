var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
let AuthService = class AuthService {
    usuariosRepository;
    jwtService;
    logger = new Logger('Auth-Security');
    accountLocks = new Map();
    MAX_FAILED_ATTEMPTS = 5;
    ACCOUNT_LOCKOUT_DURATION_MS = 10 * 60 * 1000;
    constructor(usuariosRepository, jwtService) {
        this.usuariosRepository = usuariosRepository;
        this.jwtService = jwtService;
    }
    async login(loginDto, clientIp = 'unknown') {
        const emailKey = loginDto.email.trim().toLowerCase();
        const now = Date.now();
        const lockRecord = this.accountLocks.get(emailKey);
        if (lockRecord?.lockedUntil && now < lockRecord.lockedUntil) {
            const remainingMinutes = Math.ceil((lockRecord.lockedUntil - now) / (60 * 1000));
            this.logger.warn(`🔒 [CUENTA BLOQUEADA] Intento de acceso a "${emailKey}" desde IP: ${clientIp} mientras está bloqueada.`);
            throw new UnauthorizedException(`Esta cuenta ha sido bloqueada temporalmente por seguridad tras múltiples intentos fallidos. Intenta nuevamente en ${remainingMinutes} minuto(s).`);
        }
        const user = await this.usuariosRepository.createQueryBuilder('usuario')
            .addSelect('usuario.password')
            .where('LOWER(usuario.email) = :email', { email: emailKey })
            .getOne();
        if (!user) {
            this.registerFailedAttempt(emailKey, clientIp, 'Usuario no existe');
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            this.registerFailedAttempt(emailKey, clientIp, 'Contraseña errónea');
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        this.accountLocks.delete(emailKey);
        this.logger.log(`✅ [ACCESO AUTORIZADO] Usuario: ${user.email} (${user.rol}) | IP: ${clientIp}`);
        delete user.password;
        const payload = { sub: user.id, email: user.email, rol: user.rol };
        return {
            usuario: user,
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    registerFailedAttempt(email, clientIp, motivo) {
        const now = Date.now();
        const record = this.accountLocks.get(email) || { failedCount: 0 };
        record.failedCount++;
        this.logger.warn(`⚠️ [FALLO DE ACCESO] Email: "${email}" | Motivo: ${motivo} | Intento #${record.failedCount}/${this.MAX_FAILED_ATTEMPTS} | IP: ${clientIp}`);
        if (record.failedCount >= this.MAX_FAILED_ATTEMPTS) {
            record.lockedUntil = now + this.ACCOUNT_LOCKOUT_DURATION_MS;
            this.logger.error(`⛔ [BLOQUEO AUTOMÁTICO] La cuenta "${email}" fue BLOQUEADA por 10 minutos por sospecha de ataque de fuerza bruta | IP atacante: ${clientIp}`);
        }
        this.accountLocks.set(email, record);
    }
    async validateUserToken(userId) {
        const user = await this.usuariosRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new UnauthorizedException('Usuario no encontrado');
        return user;
    }
};
AuthService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Usuario)),
    __metadata("design:paramtypes", [Repository,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map