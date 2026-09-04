import { Controller, Get, Param } from '@nestjs/common';
import { GamificacionService } from './gamificacion.service.js';

@Controller('gamificacion')
export class GamificacionController {
  constructor(private readonly gamificacionService: GamificacionService) {}

  @Get('leaderboard')
  getLeaderboard() {
    return this.gamificacionService.getLeaderboard();
  }

  @Get('perfil/:id')
  getPerfil(@Param('id') id: string) {
    return this.gamificacionService.getPerfil(id);
  }

  @Get('historial/:userId')
  getHistorial(@Param('userId') userId: string) {
    return this.gamificacionService.getHistorial(userId);
  }

  @Get('medallas/:userId')
  getMedallas(@Param('userId') userId: string) {
    return this.gamificacionService.getMedallasUsuario(userId);
  }
}
