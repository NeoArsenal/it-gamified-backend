import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { GuiasService } from './guias.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('guias')
export class GuiasController {
  constructor(private readonly guiasService: GuiasService) {}

  @Get()
  findAll() { return this.guiasService.findAll(); }

  @Get('search')
  search(@Query('q') q: string) { return this.guiasService.search(q); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.guiasService.findOne(id); }

  @Post()
  create(@Body() data: any) { return this.guiasService.create(data); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.guiasService.remove(id); }
}
