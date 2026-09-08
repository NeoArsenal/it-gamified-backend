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
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guia } from './entities/guia.entity.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
import { AccionXP } from '../gamificacion/entities/historial-xp.entity.js';
let GuiasService = class GuiasService {
    guiaRepo;
    gamificacionService;
    constructor(guiaRepo, gamificacionService) {
        this.guiaRepo = guiaRepo;
        this.gamificacionService = gamificacionService;
    }
    async findAll() { return this.guiaRepo.find({ order: { fechaSubida: 'DESC' } }); }
    async search(query) {
        if (!query)
            return this.findAll();
        return this.guiaRepo.createQueryBuilder('guia')
            .leftJoinAndSelect('guia.autor', 'autor')
            .where('LOWER(guia.titulo) LIKE LOWER(:q)', { q: `%${query}%` })
            .orWhere('LOWER(guia.contenidoRichText) LIKE LOWER(:q)', { q: `%${query}%` })
            .orderBy('guia.fechaSubida', 'DESC')
            .getMany();
    }
    async findOne(id) {
        const g = await this.guiaRepo.findOneBy({ id });
        if (!g)
            throw new NotFoundException(`Guía ${id} no encontrada`);
        return g;
    }
    async create(data) {
        const guia = await this.guiaRepo.save(this.guiaRepo.create(data));
        if (guia.autorId) {
            await this.gamificacionService.otorgarXP(guia.autorId, 200, AccionXP.GUIA_SUBIDA, `Subió la guía "${guia.titulo}"`);
        }
        return guia;
    }
    async remove(id) {
        const g = await this.findOne(id);
        await this.guiaRepo.remove(g);
    }
};
GuiasService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Guia)),
    __metadata("design:paramtypes", [Repository,
        GamificacionService])
], GuiasService);
export { GuiasService };
//# sourceMappingURL=guias.service.js.map