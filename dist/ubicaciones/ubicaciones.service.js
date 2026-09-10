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
import { Ubicacion } from './entities/ubicacion.entity.js';
let UbicacionesService = class UbicacionesService {
    ubicacionRepo;
    constructor(ubicacionRepo) {
        this.ubicacionRepo = ubicacionRepo;
    }
    async findAll() {
        return this.ubicacionRepo.find();
    }
    async findSedes() {
        const ubicaciones = await this.ubicacionRepo
            .createQueryBuilder('ubicacion')
            .select('DISTINCT ubicacion.sede', 'sede')
            .getRawMany();
        return ubicaciones.map(u => u.sede);
    }
    async findDepartamentosPorSede(sede) {
        const ubicaciones = await this.ubicacionRepo
            .createQueryBuilder('ubicacion')
            .select('DISTINCT ubicacion.departamento', 'departamento')
            .where('ubicacion.sede = :sede', { sede })
            .getRawMany();
        return ubicaciones.map(u => u.departamento);
    }
    async findAreas(sede, departamento) {
        const ubicaciones = await this.ubicacionRepo
            .createQueryBuilder('ubicacion')
            .select('DISTINCT ubicacion.area', 'area')
            .where('ubicacion.sede = :sede', { sede })
            .andWhere('ubicacion.departamento = :departamento', { departamento })
            .getRawMany();
        return ubicaciones.map(u => u.area);
    }
    async create(createUbicacionDto) {
        const ubicacion = this.ubicacionRepo.create(createUbicacionDto);
        return this.ubicacionRepo.save(ubicacion);
    }
    async remove(id) {
        const result = await this.ubicacionRepo.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Ubicacion con ID ${id} no encontrada`);
        }
    }
};
UbicacionesService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Ubicacion)),
    __metadata("design:paramtypes", [Repository])
], UbicacionesService);
export { UbicacionesService };
//# sourceMappingURL=ubicaciones.service.js.map