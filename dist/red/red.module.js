var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispositivoRed } from './entities/dispositivo-red.entity.js';
import { DireccionIP } from './entities/direccion-ip.entity.js';
import { RedService } from './red.service.js';
import { RedController } from './red.controller.js';
let RedModule = class RedModule {
};
RedModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([DispositivoRed, DireccionIP])],
        controllers: [RedController],
        providers: [RedService],
        exports: [RedService],
    })
], RedModule);
export { RedModule };
//# sourceMappingURL=red.module.js.map