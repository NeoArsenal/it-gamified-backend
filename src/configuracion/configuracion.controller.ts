import { Controller, Post, Body, Get, Put, Param } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service.js';

@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  @Post('verify-pin')
  async verifyPin(@Body('pin') pin: string) {
    const isValid = await this.configuracionService.verifyPin(pin);
    return { valid: isValid };
  }

  // Opcional: para que los técnicos puedan consultar el PIN actual en Configuración
  @Get('portal-pin')
  async getPortalPin() {
    const pin = await this.configuracionService.getValue('PORTAL_PIN', '2026');
    return { pin };
  }

  // Opcional: para que los técnicos cambien el PIN
  @Post('portal-pin')
  async setPortalPin(@Body('pin') pin: string) {
    await this.configuracionService.setValue('PORTAL_PIN', pin);
    return { success: true };
  }

  @Get('catalogos')
  async getCatalogos() {
    return this.configuracionService.getCatalogos();
  }

  @Put('catalogos/:tipo')
  async setCatalogo(
    @Param('tipo') tipo: 'departamentos' | 'categoriasActivos',
    @Body('items') items: string[]
  ) {
    return this.configuracionService.setCatalogo(tipo, items);
  }
}

