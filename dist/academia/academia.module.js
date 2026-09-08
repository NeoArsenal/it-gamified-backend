var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity.js';
import { NivelAcademia } from './entities/nivel-academia.entity.js';
import { Pregunta } from './entities/pregunta.entity.js';
import { ProgresoUsuario } from './entities/progreso-usuario.entity.js';
import { AcademiaController } from './academia.controller.js';
import { AcademiaService } from './academia.service.js';
import { GamificacionModule } from '../gamificacion/gamificacion.module.js';
let AcademiaModule = class AcademiaModule {
};
AcademiaModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forFeature([Curso, NivelAcademia, Pregunta, ProgresoUsuario]),
            GamificacionModule,
        ],
        controllers: [AcademiaController],
        providers: [AcademiaService],
    })
], AcademiaModule);
export { AcademiaModule };
//# sourceMappingURL=academia.module.js.map