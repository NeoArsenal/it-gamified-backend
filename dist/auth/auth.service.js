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
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
let AuthService = class AuthService {
    usuariosRepository;
    jwtService;
    constructor(usuariosRepository, jwtService) {
        this.usuariosRepository = usuariosRepository;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.usuariosRepository.createQueryBuilder('usuario')
            .addSelect('usuario.password')
            .where('usuario.email = :email', { email })
            .getOne();
        if (!user) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        delete user.password;
        const payload = { sub: user.id, email: user.email, rol: user.rol };
        return {
            usuario: user,
            access_token: await this.jwtService.signAsync(payload),
        };
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