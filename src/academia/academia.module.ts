import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity.js';
import { NivelAcademia } from './entities/nivel-academia.entity.js';
import { Pregunta } from './entities/pregunta.entity.js';
import { ProgresoUsuario } from './entities/progreso-usuario.entity.js';
import { AcademiaController } from './academia.controller.js';
import { AcademiaService } from './academia.service.js';
import { GamificacionModule } from '../gamificacion/gamificacion.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Curso, NivelAcademia, Pregunta, ProgresoUsuario]),
    GamificacionModule,
  ],
  controllers: [AcademiaController],
  providers: [AcademiaService],
})
export class AcademiaModule {}
