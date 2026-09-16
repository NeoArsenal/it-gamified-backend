import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { TicketRateLimitGuard } from './guards/ticket-rate-limit.guard.js';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // Consulta pública sanitizada (sin datos sensibles)
  @Get('public')
  findAllPublic() { return this.ticketsService.findAllPublic(); }

  // Acumulado de tickets activos para el portal (ABIERTO y EN_PROGRESO)
  @Get('public/active')
  getActivePublic() { return this.ticketsService.getActivePublicTickets(); }

  // Seguimiento de ticket por código o teléfono para personal asistencial
  @Get('track')
  trackTicket(@Query('q') query: string) { 
    return this.ticketsService.trackTicket(query); 
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() { return this.ticketsService.findAll(); }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats() { return this.ticketsService.getEstadisticas(); }

  @UseGuards(JwtAuthGuard)
  @Get('analytics')
  getAnalytics(@Query('sede') sede?: string) { return this.ticketsService.getAnalytics(sede); }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) { return this.ticketsService.findOne(id); }

  // Abierto para el Portal Kiosco pero protegido contra spam / DoS con Rate Limiting
  @UseGuards(TicketRateLimitGuard)
  @Post()
  create(@Body() dto: CreateTicketDto) { return this.ticketsService.create(dto); }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) { return this.ticketsService.update(id, dto); }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) { 
    console.log(`[TicketsController] Attempting to delete ticket: ${id}`);
    return this.ticketsService.remove(id); 
  }
}
