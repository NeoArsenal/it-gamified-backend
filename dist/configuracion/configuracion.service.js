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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuracion } from './entities/configuracion.entity.js';
let ConfiguracionService = class ConfiguracionService {
    configRepo;
    constructor(configRepo) {
        this.configRepo = configRepo;
    }
    async getValue(clave, defaultValue = '') {
        const config = await this.configRepo.findOne({ where: { clave } });
        return config ? config.valor : defaultValue;
    }
    async setValue(clave, valor, usuarioId) {
        let config = await this.configRepo.findOne({ where: { clave } });
        if (!config) {
            config = this.configRepo.create({ clave, valor, actualizadoPorId: usuarioId });
        }
        else {
            config.valor = valor;
            if (usuarioId) {
                config.actualizadoPorId = usuarioId;
            }
        }
        return this.configRepo.save(config);
    }
    async verifyPin(pin) {
        const actualPin = await this.getValue('PORTAL_PIN', '2026');
        return pin === actualPin;
    }
    async getCatalogos() {
        const rawDeptos = await this.getValue('CATALOGO_DEPARTAMENTOS', '');
        const rawCategorias = await this.getValue('CATALOGO_CATEGORIAS_ACTIVOS', '');
        const defaultDeptos = ['Urgencias', 'Quirófano', 'Recursos Humanos', 'Administración', 'Farmacia', 'Consultorios', 'Admisión'];
        const defaultCategorias = ['Desktop / Laptop', 'Impresora', 'Bomba de Infusión', 'Monitor Vital', 'Router / Switch', 'PC', 'Monitor'];
        let departamentos = defaultDeptos;
        let categoriasActivos = defaultCategorias;
        if (rawDeptos) {
            try {
                departamentos = JSON.parse(rawDeptos);
            }
            catch (e) {
                departamentos = defaultDeptos;
            }
        }
        if (rawCategorias) {
            try {
                categoriasActivos = JSON.parse(rawCategorias);
            }
            catch (e) {
                categoriasActivos = defaultCategorias;
            }
        }
        return { departamentos, categoriasActivos };
    }
    async setCatalogo(tipo, items, usuarioId) {
        const clave = tipo === 'departamentos' ? 'CATALOGO_DEPARTAMENTOS' : 'CATALOGO_CATEGORIAS_ACTIVOS';
        await this.setValue(clave, JSON.stringify(items), usuarioId);
        return items;
    }
};
ConfiguracionService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Configuracion)),
    __metadata("design:paramtypes", [Repository])
], ConfiguracionService);
export { ConfiguracionService };
//# sourceMappingURL=configuracion.service.js.map