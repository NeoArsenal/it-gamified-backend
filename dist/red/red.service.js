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
import { DispositivoRed, EstadoDispositivo } from './entities/dispositivo-red.entity.js';
import { DireccionIP, EstadoIP } from './entities/direccion-ip.entity.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
import { AccionXP } from '../gamificacion/entities/historial-xp.entity.js';
let RedService = class RedService {
    dispositivoRepo;
    ipRepo;
    gamificacionService;
    constructor(dispositivoRepo, ipRepo, gamificacionService) {
        this.dispositivoRepo = dispositivoRepo;
        this.ipRepo = ipRepo;
        this.gamificacionService = gamificacionService;
    }
    async onModuleInit() {
        const ips = await this.ipRepo.find();
        let changed = false;
        for (const ip of ips) {
            if (!ip.sede) {
                if (ip.ip.startsWith('10.0.20')) {
                    ip.sede = 'Sede San Isidro';
                    ip.area = 'Administración';
                }
                else if (ip.ip.startsWith('10.0.30')) {
                    ip.sede = 'Sede San Isidro';
                    ip.area = 'Urgencias';
                }
                else {
                    ip.sede = 'Sede Tower';
                    ip.area = 'Farmacia';
                }
                await this.ipRepo.save(ip);
                changed = true;
            }
        }
        if (ips.length < 10) {
            const nuevasIPs = [
                { ip: '10.0.20.104', vlan: 'VLAN 20', estado: EstadoIP.LIBRE, sede: 'Sede San Isidro', area: 'Administración' },
                { ip: '10.0.20.105', vlan: 'VLAN 20', estado: EstadoIP.LIBRE, sede: 'Sede San Isidro', area: 'Administración' },
                { ip: '10.0.30.52', vlan: 'VLAN 30', estado: EstadoIP.LIBRE, sede: 'Sede San Isidro', area: 'Urgencias' },
                { ip: '10.0.30.53', vlan: 'VLAN 30', estado: EstadoIP.LIBRE, sede: 'Sede San Isidro', area: 'Urgencias' },
                { ip: '10.1.10.10', vlan: 'VLAN 10', estado: EstadoIP.OCUPADA, sede: 'Sede Tower', area: 'UCI' },
                { ip: '10.1.10.11', vlan: 'VLAN 10', estado: EstadoIP.LIBRE, sede: 'Sede Tower', area: 'UCI' },
                { ip: '10.1.20.5', vlan: 'VLAN 20', estado: EstadoIP.OCUPADA, sede: 'Sede Tower', area: 'Farmacia' },
                { ip: '10.1.20.6', vlan: 'VLAN 20', estado: EstadoIP.LIBRE, sede: 'Sede Tower', area: 'Farmacia' },
            ];
            for (const n of nuevasIPs) {
                if (!ips.find(i => i.ip === n.ip)) {
                    await this.ipRepo.save(this.ipRepo.create(n));
                }
            }
        }
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
    async simularCaida() {
        const dispositivos = await this.dispositivoRepo.find({ where: { estado: EstadoDispositivo.ONLINE } });
        if (dispositivos.length === 0)
            return { message: 'Todos los dispositivos están offline' };
        const randomIdx = Math.floor(Math.random() * dispositivos.length);
        const victima = dispositivos[randomIdx];
        victima.estado = Math.random() > 0.5 ? EstadoDispositivo.OFFLINE : EstadoDispositivo.WARNING;
        await this.dispositivoRepo.save(victima);
        return victima;
    }
    async restaurarDispositivo(id, tecnicoId) {
        const d = await this.findDispositivo(id);
        if (d.estado === EstadoDispositivo.ONLINE)
            return d;
        d.estado = EstadoDispositivo.ONLINE;
        d.ultimoPing = new Date();
        await this.dispositivoRepo.save(d);
        if (tecnicoId) {
            await this.gamificacionService.otorgarXP(tecnicoId, 250, AccionXP.EQUIPO_RESTAURADO, `Restauró el dispositivo ${d.nombre} (${d.tipo})`);
        }
        return d;
    }
    async findAllIPs() { return this.ipRepo.find({ relations: { dispositivo: true }, order: { ip: 'ASC' } }); }
    async registrarIP(data) {
        const existe = await this.ipRepo.findOneBy({ ip: data.ip });
        if (existe)
            throw new Error(`La IP ${data.ip} ya existe`);
        return this.ipRepo.save(this.ipRepo.create({ ...data, estado: EstadoIP.LIBRE }));
    }
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
        Repository,
        GamificacionService])
], RedService);
export { RedService };
//# sourceMappingURL=red.service.js.map