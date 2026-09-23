import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guia } from './entities/guia.entity.js';
import { GuiasService } from './guias.service.js';
import { GuiasController } from './guias.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Guia])],
  controllers: [GuiasController],
  providers: [GuiasService],
  exports: [GuiasService],
})
export class GuiasModule {}
