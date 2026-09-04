import { IsOptional, IsEnum, IsString } from 'class-validator';
import { EstadoTicket, PrioridadTicket } from '../entities/ticket.entity.js';

export class UpdateTicketDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(EstadoTicket)
  @IsOptional()
  estado?: EstadoTicket;

  @IsEnum(PrioridadTicket)
  @IsOptional()
  prioridad?: PrioridadTicket;

  @IsString()
  @IsOptional()
  asignadoAId?: string;
}
