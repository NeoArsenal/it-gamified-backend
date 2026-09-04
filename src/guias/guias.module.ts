import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guia } from './entities/guia.entity.js';
import { GuiasService } from './guias.service.js';
import { GuiasController } from './guias.controller.js';
import { GamificacionModule } from '../gamificacion/gamificacion.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Guia]), GamificacionModule],
  controllers: [GuiasController],
  providers: [GuiasService],
  exports: [GuiasService],
})
export class GuiasModule {}
