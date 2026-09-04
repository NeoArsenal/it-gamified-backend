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
var GamificacionService_1;
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import { Medalla } from './entities/medalla.entity.js';
import { HistorialXP } from './entities/historial-xp.entity.js';
import { UsuarioMedalla } from './entities/usuario-medalla.entity.js';
const NIVELES = [
    0, 500, 1200, 2000, 3500, 5000, 7500, 10000, 13000, 17000,
    22000, 28000, 35000, 43000, 52000, 62000, 73000, 85000, 100000, 120000,
];
function calcularNivel(xp) {
    for (let i = NIVELES.length - 1; i >= 0; i--) {
        if (xp >= NIVELES[i])
            return i + 1;
    }
    return 1;
}
let GamificacionService = GamificacionService_1 = class GamificacionService {
    usuarioRepo;
    historialRepo;
    medallaRepo;
    umRepo;
    logger = new Logger(GamificacionService_1.name);
    constructor(usuarioRepo, historialRepo, medallaRepo, umRepo) {
        this.usuarioRepo = usuarioRepo;
        this.historialRepo = historialRepo;
        this.medallaRepo = medallaRepo;
        this.umRepo = umRepo;
    }
    async otorgarXP(usuarioId, xp, accion, descripcion) {
        const registro = this.historialRepo.create({ usuarioId, xpOtorgado: xp, accion, descripcion });
        await this.historialRepo.save(registro);
        const usuario = await this.usuarioRepo.findOneByOrFail({ id: usuarioId });
        usuario.xpActual += xp;
        const nuevoNivel = calcularNivel(usuario.xpActual);
        if (nuevoNivel > usuario.nivel) {
            this.logger.log(`🎉 ¡${usuario.nombre} subió al nivel ${nuevoNivel}!`);
        }
        usuario.nivel = nuevoNivel;
        await this.usuarioRepo.save(usuario);
        await this.verificarMedallas(usuario);
        return { xpOtorgado: xp, nuevoXP: usuario.xpActual, nivel: usuario.nivel };
    }
    async verificarMedallas(usuario) {
        const todasMedallas = await this.medallaRepo.find();
        const medallasUsuario = await this.umRepo.find({ where: { usuarioId: usuario.id } });
        const idsDesbloqueados = new Set(medallasUsuario.map((um) => um.medallaId));
        for (const medalla of todasMedallas) {
            if (!idsDesbloqueados.has(medalla.id) && usuario.xpActual >= medalla.condicionXP) {
                const nueva = this.umRepo.create({ usuarioId: usuario.id, medallaId: medalla.id });
                await this.umRepo.save(nueva);
                this.logger.log(`🏅 ${usuario.nombre} desbloqueó la medalla "${medalla.nombre}"`);
            }
        }
    }
    async getLeaderboard(limit = 10) {
        return this.usuarioRepo.find({
            order: { xpActual: 'DESC' },
            take: limit,
            select: { id: true, nombre: true, email: true, nivel: true, xpActual: true, avatar: true },
        });
    }
    async getHistorial(usuarioId) {
        return this.historialRepo.find({
            where: { usuarioId },
            order: { fecha: 'DESC' },
            take: 50,
        });
    }
    async getMedallasUsuario(usuarioId) {
        return this.umRepo.find({
            where: { usuarioId },
            relations: { medalla: true },
        });
    }
    async getPerfil(usuarioId) {
        const usuario = await this.usuarioRepo.findOneByOrFail({ id: usuarioId });
        const medallas = await this.getMedallasUsuario(usuarioId);
        const xpParaSiguienteNivel = usuario.nivel < NIVELES.length ? NIVELES[usuario.nivel] : NIVELES[NIVELES.length - 1];
        const xpNivelActual = NIVELES[usuario.nivel - 1] || 0;
        const progreso = Math.round(((usuario.xpActual - xpNivelActual) / (xpParaSiguienteNivel - xpNivelActual)) * 100);
        return {
            ...usuario,
            medallas: medallas.map((um) => um.medalla),
            xpParaSiguienteNivel,
            progresoNivel: Math.min(progreso, 100),
        };
    }
};
GamificacionService = GamificacionService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Usuario)),
    __param(1, InjectRepository(HistorialXP)),
    __param(2, InjectRepository(Medalla)),
    __param(3, InjectRepository(UsuarioMedalla)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository,
        Repository])
], GamificacionService);
export { GamificacionService };
//# sourceMappingURL=gamificacion.service.js.map