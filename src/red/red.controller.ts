import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { RedService } from './red.service.js';

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

  @Get('ips')
  findAllIPs() { return this.redService.findAllIPs(); }

  @Patch('ips/:ip/asignar')
  asignarIP(@Param('ip') ip: string, @Body('dispositivoId') dispositivoId: string) { return this.redService.asignarIP(ip, dispositivoId); }

  @Patch('ips/:ip/liberar')
  liberarIP(@Param('ip') ip: string) { return this.redService.liberarIP(ip); }
}
