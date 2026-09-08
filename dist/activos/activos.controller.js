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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ActivosService } from './activos.service.js';
import { CreateActivoDto } from './dto/create-activo.dto.js';
import { UpdateActivoDto } from './dto/update-activo.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
let ActivosController = class ActivosController {
    activosService;
    constructor(activosService) {
        this.activosService = activosService;
    }
    create(createActivoDto) {
        return this.activosService.create(createActivoDto);
    }
    findAll() {
        return this.activosService.findAll();
    }
    findOne(id) {
        return this.activosService.findOne(id);
    }
    update(id, updateActivoDto) {
        return this.activosService.update(id, updateActivoDto);
    }
    addIntervencion(id, body) {
        return this.activosService.addIntervencion(id, body.descripcion, body.tecnicoId);
    }
    remove(id) {
        return this.activosService.remove(id);
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateActivoDto]),
    __metadata("design:returntype", void 0)
], ActivosController.prototype, "create", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ActivosController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ActivosController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateActivoDto]),
    __metadata("design:returntype", void 0)
], ActivosController.prototype, "update", null);
__decorate([
    Post(':id/intervenciones'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ActivosController.prototype, "addIntervencion", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ActivosController.prototype, "remove", null);
ActivosController = __decorate([
    UseGuards(JwtAuthGuard),
    Controller('activos'),
    __metadata("design:paramtypes", [ActivosService])
], ActivosController);
export { ActivosController };
//# sourceMappingURL=activos.controller.js.map