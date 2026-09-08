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
var _a, _b;
import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
let StorageController = class StorageController {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    async uploadFile(file) {
        if (!file) {
            throw new BadRequestException('No se ha proporcionado ningún archivo');
        }
        const publicUrl = await this.storageService.uploadFile(file);
        return { url: publicUrl };
    }
};
__decorate([
    Post('upload'),
    UseInterceptors(FileInterceptor('file')),
    __param(0, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "uploadFile", null);
StorageController = __decorate([
    UseGuards(JwtAuthGuard),
    Controller('storage'),
    __metadata("design:paramtypes", [StorageService])
], StorageController);
export { StorageController };
//# sourceMappingURL=storage.controller.js.map