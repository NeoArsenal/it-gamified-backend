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
import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { RedService } from './red.service.js';
let RedController = class RedController {
    redService;
    constructor(redService) {
        this.redService = redService;
    }
    findAllDispositivos() { return this.redService.findAllDispositivos(); }
    findDispositivo(id) { return this.redService.findDispositivo(id); }
    createDispositivo(data) { return this.redService.createDispositivo(data); }
    updateDispositivo(id, data) { return this.redService.updateDispositivo(id, data); }
    findAllIPs() { return this.redService.findAllIPs(); }
    asignarIP(ip, dispositivoId) { return this.redService.asignarIP(ip, dispositivoId); }
    liberarIP(ip) { return this.redService.liberarIP(ip); }
};
__decorate([
    Get('dispositivos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RedController.prototype, "findAllDispositivos", null);
__decorate([
    Get('dispositivos/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RedController.prototype, "findDispositivo", null);
__decorate([
    Post('dispositivos'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RedController.prototype, "createDispositivo", null);
__decorate([
    Patch('dispositivos/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RedController.prototype, "updateDispositivo", null);
__decorate([
    Get('ips'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RedController.prototype, "findAllIPs", null);
__decorate([
    Patch('ips/:ip/asignar'),
    __param(0, Param('ip')),
    __param(1, Body('dispositivoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RedController.prototype, "asignarIP", null);
__decorate([
    Patch('ips/:ip/liberar'),
    __param(0, Param('ip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RedController.prototype, "liberarIP", null);
RedController = __decorate([
    Controller('red'),
    __metadata("design:paramtypes", [RedService])
], RedController);
export { RedController };
//# sourceMappingURL=red.controller.js.map