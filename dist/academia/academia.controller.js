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
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AcademiaService } from './academia.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
let AcademiaController = class AcademiaController {
    academiaService;
    constructor(academiaService) {
        this.academiaService = academiaService;
    }
    getCursos(userId) {
        if (!userId) {
            userId = '4e447e7e-0824-49d1-9abd-490209ad77de';
        }
        return this.academiaService.getCursos(userId);
    }
    getNivelConPreguntas(id) {
        return this.academiaService.getNivelConPreguntas(id);
    }
    completarNivel(body) {
        let { userId, nivelId } = body;
        if (!userId)
            userId = '4e447e7e-0824-49d1-9abd-490209ad77de';
        return this.academiaService.completarNivel(userId, nivelId);
    }
};
__decorate([
    Get('cursos'),
    __param(0, Query('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademiaController.prototype, "getCursos", null);
__decorate([
    Get('niveles/:id/preguntas'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AcademiaController.prototype, "getNivelConPreguntas", null);
__decorate([
    Post('completar'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademiaController.prototype, "completarNivel", null);
AcademiaController = __decorate([
    UseGuards(JwtAuthGuard),
    Controller('academia'),
    __metadata("design:paramtypes", [AcademiaService])
], AcademiaController);
export { AcademiaController };
//# sourceMappingURL=academia.controller.js.map