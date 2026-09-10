var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UbicacionesService } from './ubicaciones.service.js';
import { UbicacionesController } from './ubicaciones.controller.js';
import { Ubicacion } from './entities/ubicacion.entity.js';
let UbicacionesModule = class UbicacionesModule {
};
UbicacionesModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([Ubicacion])],
        controllers: [UbicacionesController],
        providers: [UbicacionesService],
        exports: [UbicacionesService],
    })
], UbicacionesModule);
export { UbicacionesModule };
//# sourceMappingURL=ubicaciones.module.js.map