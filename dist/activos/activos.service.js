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
var ActivosService_1;
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activo, EstadoActivo } from './entities/activo.entity.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
import { AccionXP } from '../gamificacion/entities/historial-xp.entity.js';
let ActivosService = ActivosService_1 = class ActivosService {
    activoRepo;
    gamificacionService;
    logger = new Logger(ActivosService_1.name);
    constructor(activoRepo, gamificacionService) {
        this.activoRepo = activoRepo;
        this.gamificacionService = gamificacionService;
    }
    async findAll() {
        return this.activoRepo.find({ order: { fechaRegistro: 'DESC' } });
    }
    async findOne(id) {
        const activo = await this.activoRepo.findOneBy({ id });
        if (!activo)
            throw new NotFoundException(`Activo ${id} no encontrado`);
        return activo;
    }
    async create(dto) {
        const activo = this.activoRepo.create({
            ...dto,
            estado: dto.estado || EstadoActivo.REPARACION
        });
        return this.activoRepo.save(activo);
    }
    async update(id, dto) {
        const activo = await this.findOne(id);
        const estadoAnterior = activo.estado;
        Object.assign(activo, dto);
        const saved = await this.activoRepo.save(activo);
        if (dto.estado === EstadoActivo.RESCATADO && estadoAnterior !== EstadoActivo.RESCATADO && dto.tecnicoId) {
            const xpRecompensa = 1000;
            const res = await this.gamificacionService.otorgarXP(dto.tecnicoId, xpRecompensa, AccionXP.BONUS_ADMIN, `Rescató el equipo ${activo.codigo} de la chatarra`);
            this.logger.log(`s +${xpRecompensa} XP a ${dto.tecnicoId} por rescatar equipo ${activo.codigo}`);
        }
        return saved;
    }
    async remove(id) {
        const activo = await this.findOne(id);
        await this.activoRepo.remove(activo);
    }
};
ActivosService = ActivosService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Activo)),
    __metadata("design:paramtypes", [Repository,
        GamificacionService])
], ActivosService);
export { ActivosService };
//# sourceMappingURL=activos.service.js.map