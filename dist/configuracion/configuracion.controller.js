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
import { Controller, Post, Body, Get } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service.js';
let ConfiguracionController = class ConfiguracionController {
    configuracionService;
    constructor(configuracionService) {
        this.configuracionService = configuracionService;
    }
    async verifyPin(pin) {
        const isValid = await this.configuracionService.verifyPin(pin);
        return { valid: isValid };
    }
    async getPortalPin() {
        const pin = await this.configuracionService.getValue('PORTAL_PIN', '2026');
        return { pin };
    }
    async setPortalPin(pin) {
        await this.configuracionService.setValue('PORTAL_PIN', pin);
        return { success: true };
    }
};
__decorate([
    Post('verify-pin'),
    __param(0, Body('pin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfiguracionController.prototype, "verifyPin", null);
__decorate([
    Get('portal-pin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfiguracionController.prototype, "getPortalPin", null);
__decorate([
    Post('portal-pin'),
    __param(0, Body('pin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfiguracionController.prototype, "setPortalPin", null);
ConfiguracionController = __decorate([
    Controller('configuracion'),
    __metadata("design:paramtypes", [ConfiguracionService])
], ConfiguracionController);
export { ConfiguracionController };
//# sourceMappingURL=configuracion.controller.js.map