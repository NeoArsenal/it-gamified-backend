import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AcademiaService } from './academia.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('academia')
export class AcademiaController {
  constructor(private readonly academiaService: AcademiaService) {}

  @Get('cursos')
  getCursos(@Query('userId') userId: string) {
    if (!userId) {
      // Si no envían userId, usamos un fallback por ahora para probar
      userId = '4e447e7e-0824-49d1-9abd-490209ad77de'; 
    }
    return this.academiaService.getCursos(userId);
  }

  @Get('niveles/:id/preguntas')
  getNivelConPreguntas(@Param('id') id: string) {
    return this.academiaService.getNivelConPreguntas(id);
  }

  @Post('completar')
  completarNivel(@Body() body: { userId: string; nivelId: string }) {
    let { userId, nivelId } = body;
    if (!userId) userId = '4e447e7e-0824-49d1-9abd-490209ad77de';
    return this.academiaService.completarNivel(userId, nivelId);
  }
}
