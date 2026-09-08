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
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity.js';
let UsuariosService = class UsuariosService {
    usuarioRepository;
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    async findAll() {
        return this.usuarioRepository.find();
    }
    async findOne(id) {
        const usuario = await this.usuarioRepository.findOne({ where: { id } });
        if (!usuario) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return usuario;
    }
    async createUsuario(data) {
        const existingUser = await this.usuarioRepository.findOne({ where: { email: data.email } });
        if (existingUser)
            throw new BadRequestException('El correo ya está registrado');
        const hash = await bcrypt.hash(data.password || '123456', 10);
        const user = this.usuarioRepository.create({
            ...data,
            password: hash,
            modulosAccesibles: data.modulosAccesibles || ['dashboard', 'tickets', 'knowledge', 'academy', 'settings']
        });
        return this.usuarioRepository.save(user);
    }
    async updateUsuario(id, data) {
        const user = await this.findOne(id);
        if (data.nombre)
            user.nombre = data.nombre;
        if (data.email)
            user.email = data.email;
        if (data.rol)
            user.rol = data.rol;
        if (data.modulosAccesibles)
            user.modulosAccesibles = data.modulosAccesibles;
        if (data.password) {
            user.password = await bcrypt.hash(data.password, 10);
        }
        return this.usuarioRepository.save(user);
    }
    async updatePreferencias(id, data) {
        const usuario = await this.findOne(id);
        if (data.avatar !== undefined)
            usuario.avatar = data.avatar;
        if (data.tituloRPG !== undefined)
            usuario.tituloRPG = data.tituloRPG;
        if (data.preferencias !== undefined) {
            usuario.preferencias = {
                ...(usuario.preferencias || {}),
                ...data.preferencias
            };
        }
        return this.usuarioRepository.save(usuario);
    }
};
UsuariosService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Usuario)),
    __metadata("design:paramtypes", [Repository])
], UsuariosService);
export { UsuariosService };
//# sourceMappingURL=usuarios.service.js.map