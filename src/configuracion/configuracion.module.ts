import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionService } from './configuracion.service.js';
import { ConfiguracionController } from './configuracion.controller.js';
import { Configuracion } from './entities/configuracion.entity.js';
import { PinRateLimitGuard } from './guards/pin-rate-limit.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([Configuracion])],
  controllers: [ConfiguracionController],
  providers: [ConfiguracionService, PinRateLimitGuard],
  exports: [ConfiguracionService]
})
export class ConfiguracionModule {}
