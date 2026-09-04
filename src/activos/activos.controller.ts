import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActivosService } from './activos.service.js';
import { CreateActivoDto } from './dto/create-activo.dto.js';
import { UpdateActivoDto } from './dto/update-activo.dto.js';

@Controller('activos')
export class ActivosController {
  constructor(private readonly activosService: ActivosService) {}

  @Post()
  create(@Body() createActivoDto: CreateActivoDto) {
    return this.activosService.create(createActivoDto);
  }

  @Get()
  findAll() {
    return this.activosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivoDto: UpdateActivoDto) {
    return this.activosService.update(id, updateActivoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activosService.remove(id);
  }
}
