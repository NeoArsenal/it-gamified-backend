var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service.js';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import { Medalla } from '../gamificacion/entities/medalla.entity.js';
import { Ticket } from '../tickets/entities/ticket.entity.js';
import { DispositivoRed } from '../red/entities/dispositivo-red.entity.js';
import { DireccionIP } from '../red/entities/direccion-ip.entity.js';
import { Guia } from '../guias/entities/guia.entity.js';
import { Ubicacion } from '../ubicaciones/entities/ubicacion.entity.js';
let SeedModule = class SeedModule {
};
SeedModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([Usuario, Medalla, Ticket, DispositivoRed, DireccionIP, Guia, Ubicacion])],
        providers: [SeedService],
    })
], SeedModule);
export { SeedModule };
//# sourceMappingURL=seed.module.js.map