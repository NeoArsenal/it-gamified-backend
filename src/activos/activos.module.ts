import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivosService } from './activos.service.js';
import { ActivosController } from './activos.controller.js';
import { Activo } from './entities/activo.entity.js';
import { GamificacionModule } from '../gamificacion/gamificacion.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activo]),
    GamificacionModule,
  ],
  controllers: [ActivosController],
  providers: [ActivosService],
})
export class ActivosModule {}
