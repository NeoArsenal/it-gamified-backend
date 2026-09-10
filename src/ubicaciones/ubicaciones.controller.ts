import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { UbicacionesService } from './ubicaciones.service.js';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto.js';

@Controller('ubicaciones')
export class UbicacionesController {
  constructor(private readonly ubicacionesService: UbicacionesService) {}

  @Post()
  create(@Body() createUbicacionDto: CreateUbicacionDto) {
    return this.ubicacionesService.create(createUbicacionDto);
  }

  @Get()
  findAll() {
    return this.ubicacionesService.findAll();
  }

  @Get('sedes')
  findSedes() {
    return this.ubicacionesService.findSedes();
  }

  @Get('departamentos')
  findDepartamentos(@Query('sede') sede: string) {
    if (!sede) return [];
    return this.ubicacionesService.findDepartamentosPorSede(sede);
  }

  @Get('areas')
  findAreas(@Query('sede') sede: string, @Query('departamento') departamento: string) {
    if (!sede || !departamento) return [];
    return this.ubicacionesService.findAreas(sede, departamento);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ubicacionesService.remove(id);
  }
}
