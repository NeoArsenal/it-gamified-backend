import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { GuiasService } from './guias.service.js';

@Controller('guias')
export class GuiasController {
  constructor(private readonly guiasService: GuiasService) {}

  @Get()
  findAll() { return this.guiasService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.guiasService.findOne(id); }

  @Post()
  create(@Body() data: any) { return this.guiasService.create(data); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.guiasService.remove(id); }
}
