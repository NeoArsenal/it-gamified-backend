var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { Usuario } from './usuarios/entities/usuario.entity.js';
import { Ticket } from './tickets/entities/ticket.entity.js';
import { HistorialXP } from './gamificacion/entities/historial-xp.entity.js';
import { Medalla } from './gamificacion/entities/medalla.entity.js';
import { UsuarioMedalla } from './gamificacion/entities/usuario-medalla.entity.js';
import { DispositivoRed } from './red/entities/dispositivo-red.entity.js';
import { DireccionIP } from './red/entities/direccion-ip.entity.js';
import { Guia } from './guias/entities/guia.entity.js';
import { Activo } from './activos/entities/activo.entity.js';
import { Intervencion } from './activos/entities/intervencion.entity.js';
import { Curso } from './academia/entities/curso.entity.js';
import { NivelAcademia } from './academia/entities/nivel-academia.entity.js';
import { Pregunta } from './academia/entities/pregunta.entity.js';
import { ProgresoUsuario } from './academia/entities/progreso-usuario.entity.js';
import { AuthModule } from './auth/auth.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { GamificacionModule } from './gamificacion/gamificacion.module.js';
import { RedModule } from './red/red.module.js';
import { GuiasModule } from './guias/guias.module.js';
import { SeedModule } from './seed/seed.module.js';
import { ActivosModule } from './activos/activos.module.js';
import { AcademiaModule } from './academia/academia.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forRoot({
                type: 'better-sqlite3',
                database: 'data/it-helpdesk.db',
                entities: [Usuario, Ticket, HistorialXP, Medalla, UsuarioMedalla, DispositivoRed, DireccionIP, Guia, Activo, Intervencion, Curso, NivelAcademia, Pregunta, ProgresoUsuario],
                synchronize: true,
            }),
            AuthModule,
            UsuariosModule,
            TicketsModule,
            GamificacionModule,
            RedModule,
            GuiasModule,
            SeedModule,
            ActivosModule,
            AcademiaModule,
        ],
        controllers: [AppController],
        providers: [AppService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map