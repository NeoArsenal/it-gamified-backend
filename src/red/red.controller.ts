import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { RedService } from './red.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('red')
export class RedController {
  constructor(private readonly redService: RedService) {}

  @Get('dispositivos')
  findAllDispositivos() { return this.redService.findAllDispositivos(); }

  @Get('dispositivos/:id')
  findDispositivo(@Param('id') id: string) { return this.redService.findDispositivo(id); }

  @Post('dispositivos')
  createDispositivo(@Body() data: any) { return this.redService.createDispositivo(data); }

  @Patch('dispositivos/:id')
  updateDispositivo(@Param('id') id: string, @Body() data: any) { return this.redService.updateDispositivo(id, data); }

  @Post('dispositivos/simular-caida')
  simularCaida() { return this.redService.simularCaida(); }

  @Patch('dispositivos/:id/restaurar')
  restaurarDispositivo(@Param('id') id: string, @Body('tecnicoId') tecnicoId: string) { return this.redService.restaurarDispositivo(id, tecnicoId); }

  @Get('ips')
  findAllIPs() { return this.redService.findAllIPs(); }

  @Post('ips')
  registrarIP(@Body() data: any) { return this.redService.registrarIP(data); }

  @Patch('ips/:ip/asignar')
  asignarIP(@Param('ip') ip: string, @Body('dispositivoId') dispositivoId: string) { return this.redService.asignarIP(ip, dispositivoId); }

  @Patch('ips/:ip/liberar')
  liberarIP(@Param('ip') ip: string) { return this.redService.liberarIP(ip); }
}
