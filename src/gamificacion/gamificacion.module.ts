import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialXP } from './entities/historial-xp.entity.js';
import { Medalla } from './entities/medalla.entity.js';
import { UsuarioMedalla } from './entities/usuario-medalla.entity.js';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import { GamificacionService } from './gamificacion.service.js';
import { GamificacionController } from './gamificacion.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialXP, Medalla, UsuarioMedalla, Usuario])],
  controllers: [GamificacionController],
  providers: [GamificacionService],
  exports: [GamificacionService],
})
export class GamificacionModule {}
