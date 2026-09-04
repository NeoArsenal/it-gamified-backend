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
import { Controller, Get, Param } from '@nestjs/common';
import { GamificacionService } from './gamificacion.service.js';
let GamificacionController = class GamificacionController {
    gamificacionService;
    constructor(gamificacionService) {
        this.gamificacionService = gamificacionService;
    }
    getLeaderboard() {
        return this.gamificacionService.getLeaderboard();
    }
    getPerfil(id) {
        return this.gamificacionService.getPerfil(id);
    }
    getHistorial(userId) {
        return this.gamificacionService.getHistorial(userId);
    }
    getMedallas(userId) {
        return this.gamificacionService.getMedallasUsuario(userId);
    }
};
__decorate([
    Get('leaderboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GamificacionController.prototype, "getLeaderboard", null);
__decorate([
    Get('perfil/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamificacionController.prototype, "getPerfil", null);
__decorate([
    Get('historial/:userId'),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamificacionController.prototype, "getHistorial", null);
__decorate([
    Get('medallas/:userId'),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GamificacionController.prototype, "getMedallas", null);
GamificacionController = __decorate([
    Controller('gamificacion'),
    __metadata("design:paramtypes", [GamificacionService])
], GamificacionController);
export { GamificacionController };
//# sourceMappingURL=gamificacion.controller.js.map