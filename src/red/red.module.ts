import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispositivoRed } from './entities/dispositivo-red.entity.js';
import { DireccionIP } from './entities/direccion-ip.entity.js';
import { RedService } from './red.service.js';
import { RedController } from './red.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([DispositivoRed, DireccionIP])],
  controllers: [RedController],
  providers: [RedService],
  exports: [RedService],
})
export class RedModule {}
