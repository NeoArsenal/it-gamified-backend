var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guia } from './entities/guia.entity.js';
import { GuiasService } from './guias.service.js';
import { GuiasController } from './guias.controller.js';
import { GamificacionModule } from '../gamificacion/gamificacion.module.js';
let GuiasModule = class GuiasModule {
};
GuiasModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([Guia]), GamificacionModule],
        controllers: [GuiasController],
        providers: [GuiasService],
        exports: [GuiasService],
    })
], GuiasModule);
export { GuiasModule };
//# sourceMappingURL=guias.module.js.map