import { Controller, Post, Body, Get, Put, Param, UseGuards, Request } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  @Post('verify-access')
  async verifyAccess(@Body('pin') pin?: string, @Body('token') token?: string) {
    const isValid = await this.configuracionService.verifyAccess(pin, token);
    return { valid: isValid };
  }

  @Post('verify-pin')
  async verifyPin(@Body('pin') pin: string) {
    const isValid = await this.configuracionService.verifyPin(pin);
    return { valid: isValid };
  }

  // Consulta de configuración del portal (PIN y Token seguro)
  @Get('portal-config')
  async getPortalConfig() {
    const pin = await this.configuracionService.getValue('PORTAL_PIN', '2026');
    const token = await this.configuracionService.getPortalToken();
    return { pin, token };
  }

  // Consulta del PIN actual
  @Get('portal-pin')
  async getPortalPin() {
    const pin = await this.configuracionService.getValue('PORTAL_PIN', '2026');
    return { pin };
  }

  // Cambio de PIN con auditoría de usuario
  @UseGuards(JwtAuthGuard)
  @Post('portal-pin')
  async setPortalPin(@Body('pin') pin: string, @Request() req: any) {
    await this.configuracionService.setValue('PORTAL_PIN', pin, req.user?.id);
    return { success: true };
  }

  // Regeneración de llave criptográfica del portal para código QR
  @UseGuards(JwtAuthGuard)
  @Post('portal-token/regenerate')
  async regeneratePortalToken(@Request() req: any) {
    const token = await this.configuracionService.regeneratePortalToken(req.user?.id);
    return { token };
  }

  @Get('catalogos')
  async getCatalogos() {
    return this.configuracionService.getCatalogos();
  }

  // Actualización de catálogos con auditoría de usuario
  @UseGuards(JwtAuthGuard)
  @Put('catalogos/:tipo')
  async setCatalogo(
    @Param('tipo') tipo: 'departamentos' | 'categoriasActivos',
    @Body('items') items: string[],
    @Request() req: any,
  ) {
    return this.configuracionService.setCatalogo(tipo, items, req.user?.id);
  }
}

