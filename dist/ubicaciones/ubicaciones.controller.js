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
import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { UbicacionesService } from './ubicaciones.service.js';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto.js';
let UbicacionesController = class UbicacionesController {
    ubicacionesService;
    constructor(ubicacionesService) {
        this.ubicacionesService = ubicacionesService;
    }
    create(createUbicacionDto) {
        return this.ubicacionesService.create(createUbicacionDto);
    }
    findAll() {
        return this.ubicacionesService.findAll();
    }
    findSedes() {
        return this.ubicacionesService.findSedes();
    }
    findDepartamentos(sede) {
        if (!sede)
            return [];
        return this.ubicacionesService.findDepartamentosPorSede(sede);
    }
    findAreas(sede, departamento) {
        if (!sede || !departamento)
            return [];
        return this.ubicacionesService.findAreas(sede, departamento);
    }
    remove(id) {
        return this.ubicacionesService.remove(id);
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUbicacionDto]),
    __metadata("design:returntype", void 0)
], UbicacionesController.prototype, "create", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UbicacionesController.prototype, "findAll", null);
__decorate([
    Get('sedes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UbicacionesController.prototype, "findSedes", null);
__decorate([
    Get('departamentos'),
    __param(0, Query('sede')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UbicacionesController.prototype, "findDepartamentos", null);
__decorate([
    Get('areas'),
    __param(0, Query('sede')),
    __param(1, Query('departamento')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UbicacionesController.prototype, "findAreas", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UbicacionesController.prototype, "remove", null);
UbicacionesController = __decorate([
    Controller('ubicaciones'),
    __metadata("design:paramtypes", [UbicacionesService])
], UbicacionesController);
export { UbicacionesController };
//# sourceMappingURL=ubicaciones.controller.js.map