import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service.js';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import { Medalla } from '../gamificacion/entities/medalla.entity.js';
import { Ticket } from '../tickets/entities/ticket.entity.js';
import { DispositivoRed } from '../red/entities/dispositivo-red.entity.js';
import { DireccionIP } from '../red/entities/direccion-ip.entity.js';
import { Guia } from '../guias/entities/guia.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Medalla, Ticket, DispositivoRed, DireccionIP, Guia])],
  providers: [SeedService],
})
export class SeedModule {}
