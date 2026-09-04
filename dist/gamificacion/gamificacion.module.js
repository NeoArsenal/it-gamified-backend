var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialXP } from './entities/historial-xp.entity.js';
import { Medalla } from './entities/medalla.entity.js';
import { UsuarioMedalla } from './entities/usuario-medalla.entity.js';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import { GamificacionService } from './gamificacion.service.js';
import { GamificacionController } from './gamificacion.controller.js';
let GamificacionModule = class GamificacionModule {
};
GamificacionModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([HistorialXP, Medalla, UsuarioMedalla, Usuario])],
        controllers: [GamificacionController],
        providers: [GamificacionService],
        exports: [GamificacionService],
    })
], GamificacionModule);
export { GamificacionModule };
//# sourceMappingURL=gamificacion.module.js.map