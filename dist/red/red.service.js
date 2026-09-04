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
import { DispositivoRed } from './entities/dispositivo-red.entity.js';
import { DireccionIP, EstadoIP } from './entities/direccion-ip.entity.js';
let RedService = class RedService {
    dispositivoRepo;
    ipRepo;
    constructor(dispositivoRepo, ipRepo) {
        this.dispositivoRepo = dispositivoRepo;
        this.ipRepo = ipRepo;
    }
    async findAllDispositivos() { return this.dispositivoRepo.find({ order: { nombre: 'ASC' } }); }
    async findDispositivo(id) {
        const d = await this.dispositivoRepo.findOne({ where: { id }, relations: { direccionesIP: true } });
        if (!d)
            throw new NotFoundException(`Dispositivo ${id} no encontrado`);
        return d;
    }
    async createDispositivo(data) { return this.dispositivoRepo.save(this.dispositivoRepo.create(data)); }
    async updateDispositivo(id, data) {
        const d = await this.findDispositivo(id);
        Object.assign(d, data);
        return this.dispositivoRepo.save(d);
    }
    async findAllIPs() { return this.ipRepo.find({ relations: { dispositivo: true }, order: { ip: 'ASC' } }); }
    async asignarIP(ip, dispositivoId) {
        const direccion = await this.ipRepo.findOneBy({ ip });
        if (!direccion)
            throw new NotFoundException(`IP ${ip} no registrada`);
        direccion.dispositivoId = dispositivoId;
        direccion.estado = EstadoIP.OCUPADA;
        return this.ipRepo.save(direccion);
    }
    async liberarIP(ip) {
        const direccion = await this.ipRepo.findOneBy({ ip });
        if (!direccion)
            throw new NotFoundException(`IP ${ip} no registrada`);
        direccion.dispositivoId = null;
        direccion.estado = EstadoIP.LIBRE;
        return this.ipRepo.save(direccion);
    }
};
RedService = __decorate([
    Injectable(),
    __param(0, InjectRepository(DispositivoRed)),
    __param(1, InjectRepository(DireccionIP)),
    __metadata("design:paramtypes", [Repository,
        Repository])
], RedService);
export { RedService };
//# sourceMappingURL=red.service.js.map