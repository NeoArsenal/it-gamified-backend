import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

// Entidades
import { Usuario } from './usuarios/entities/usuario.entity.js';
import { Ticket } from './tickets/entities/ticket.entity.js';
import { HistorialXP } from './gamificacion/entities/historial-xp.entity.js';
import { Medalla } from './gamificacion/entities/medalla.entity.js';
import { UsuarioMedalla } from './gamificacion/entities/usuario-medalla.entity.js';
import { DispositivoRed } from './red/entities/dispositivo-red.entity.js';
import { DireccionIP } from './red/entities/direccion-ip.entity.js';
import { Guia } from './guias/entities/guia.entity.js';
import { Activo } from './activos/entities/activo.entity.js';

// Módulos
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { GamificacionModule } from './gamificacion/gamificacion.module.js';
import { RedModule } from './red/red.module.js';
import { GuiasModule } from './guias/guias.module.js';
import { SeedModule } from './seed/seed.module.js';
import { ActivosModule } from './activos/activos.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'data/it-helpdesk.db',
      entities: [Usuario, Ticket, HistorialXP, Medalla, UsuarioMedalla, DispositivoRed, DireccionIP, Guia, Activo],
      synchronize: true, // Auto-crear tablas (solo para desarrollo)
    }),
    UsuariosModule,
    TicketsModule,
    GamificacionModule,
    RedModule,
    GuiasModule,
    SeedModule,
    ActivosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
