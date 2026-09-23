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
var UsuariosService_1;
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity.js';
import { Ticket } from '../tickets/entities/ticket.entity.js';
import { Guia } from '../guias/entities/guia.entity.js';
import { Ubicacion } from '../ubicaciones/entities/ubicacion.entity.js';
import { Activo } from '../activos/entities/activo.entity.js';
import { Intervencion } from '../activos/entities/intervencion.entity.js';
import { Configuracion } from '../configuracion/entities/configuracion.entity.js';
import { UsuarioMedalla } from '../gamificacion/entities/usuario-medalla.entity.js';
import { HistorialXP } from '../gamificacion/entities/historial-xp.entity.js';
import { ProgresoUsuario } from '../academia/entities/progreso-usuario.entity.js';
import { StorageService } from '../storage/storage.service.js';
let UsuariosService = UsuariosService_1 = class UsuariosService {
    usuarioRepository;
    storageService;
    dataSource;
    logger = new Logger(UsuariosService_1.name);
    constructor(usuarioRepository, storageService, dataSource) {
        this.usuarioRepository = usuarioRepository;
        this.storageService = storageService;
        this.dataSource = dataSource;
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
        if (data.avatar !== undefined && data.avatar !== usuario.avatar) {
            if (usuario.avatar && (usuario.avatar.includes('supabase.co') || usuario.avatar.startsWith('uploads/'))) {
                await this.storageService.deleteFile(usuario.avatar).catch((err) => {
                    this.logger.warn(`No se pudo eliminar foto previa de Supabase: ${err.message}`);
                });
            }
            usuario.avatar = data.avatar;
        }
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
    async deleteUsuario(id, currentUserId) {
        if (currentUserId && id === currentUserId) {
            throw new BadRequestException('No puedes eliminar tu propia cuenta de administrador en sesión');
        }
        const user = await this.findOne(id);
        if (user.avatar && (user.avatar.includes('supabase.co') || user.avatar.startsWith('uploads/'))) {
            await this.storageService.deleteFile(user.avatar).catch(() => null);
        }
        try {
            await this.dataSource.transaction(async (manager) => {
                await manager.delete(UsuarioMedalla, { usuarioId: id });
                await manager.delete(HistorialXP, { usuarioId: id });
                await manager.delete(ProgresoUsuario, { usuarioId: id });
                await manager.update(Ticket, { asignadoAId: id }, { asignadoAId: null });
                await manager.update(Guia, { autorId: id }, { autorId: null });
                await manager.update(Ubicacion, { creadoPorId: id }, { creadoPorId: null });
                await manager.update(Intervencion, { tecnicoId: id }, { tecnicoId: null });
                await manager.update(Activo, { registradoPorId: id }, { registradoPorId: null });
                await manager.update(Configuracion, { actualizadoPorId: id }, { actualizadoPorId: null });
                await manager.delete(Usuario, { id });
            });
            this.logger.log(`Usuario ${user.nombre} (${user.email}) eliminado exitosamente`);
            return { success: true, message: `Usuario ${user.nombre} eliminado correctamente` };
        }
        catch (error) {
            this.logger.error(`Error al eliminar usuario ${id}: ${error.message}`, error.stack);
            throw new BadRequestException(`No se pudo eliminar el usuario: ${error.message}`);
        }
    }
};
UsuariosService = UsuariosService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Usuario)),
    __metadata("design:paramtypes", [Repository,
        StorageService,
        DataSource])
], UsuariosService);
export { UsuariosService };
//# sourceMappingURL=usuarios.service.js.map