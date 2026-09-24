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
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { TicketsService } from './tickets.service.js';
import { StorageService } from '../storage/storage.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { TicketRateLimitGuard } from './guards/ticket-rate-limit.guard.js';
let TicketsController = class TicketsController {
    ticketsService;
    storageService;
    constructor(ticketsService, storageService) {
        this.ticketsService = ticketsService;
        this.storageService = storageService;
    }
    findAllPublic() { return this.ticketsService.findAllPublic(); }
    getActivePublic() { return this.ticketsService.getActivePublicTickets(); }
    trackTicket(query) {
        return this.ticketsService.trackTicket(query);
    }
    findAll() { return this.ticketsService.findAll(); }
    getStats() { return this.ticketsService.getEstadisticas(); }
    getAnalytics(sede) { return this.ticketsService.getAnalytics(sede); }
    findOne(id) { return this.ticketsService.findOne(id); }
    async uploadFoto(file) {
        if (!file) {
            throw new BadRequestException('No se ha proporcionado ninguna imagen');
        }
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/heic', 'image/heif'];
        if (!allowedMimes.includes(file.mimetype)) {
            throw new BadRequestException('Formato de imagen no permitido. Solo se aceptan fotos (JPEG, PNG, WEBP).');
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new BadRequestException('La foto no debe superar los 5 MB');
        }
        const publicUrl = await this.storageService.uploadFile(file, 'incidencias');
        return { url: publicUrl };
    }
    create(dto) { return this.ticketsService.create(dto); }
    update(id, dto) { return this.ticketsService.update(id, dto); }
    remove(id) {
        console.log(`[TicketsController] Attempting to delete ticket: ${id}`);
        return this.ticketsService.remove(id);
    }
};
__decorate([
    Get('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findAllPublic", null);
__decorate([
    Get('public/active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "getActivePublic", null);
__decorate([
    Get('track'),
    __param(0, Query('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "trackTicket", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findAll", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Get('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "getStats", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Get('analytics'),
    __param(0, Query('sede')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "getAnalytics", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findOne", null);
__decorate([
    UseGuards(TicketRateLimitGuard),
    Post('upload-foto'),
    UseInterceptors(FileInterceptor('file')),
    __param(0, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "uploadFoto", null);
__decorate([
    UseGuards(TicketRateLimitGuard),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTicketDto]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "create", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateTicketDto]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "update", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "remove", null);
TicketsController = __decorate([
    Controller('tickets'),
    __metadata("design:paramtypes", [TicketsService,
        StorageService])
], TicketsController);
export { TicketsController };
//# sourceMappingURL=tickets.controller.js.map