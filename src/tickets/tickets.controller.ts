import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  findAll() { return this.ticketsService.findAll(); }

  @Get('stats')
  getStats() { return this.ticketsService.getEstadisticas(); }

  @Get('analytics')
  getAnalytics() { return this.ticketsService.getAnalytics(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.ticketsService.findOne(id); }

  @Post()
  create(@Body() dto: CreateTicketDto) { return this.ticketsService.create(dto); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) { return this.ticketsService.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.ticketsService.remove(id); }
}
