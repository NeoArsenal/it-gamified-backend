import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { PrioridadTicket } from '../entities/ticket.entity.js';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(PrioridadTicket)
  @IsOptional()
  prioridad?: PrioridadTicket;

  @IsString()
  @IsOptional()
  asignadoAId?: string;

  @IsString()
  @IsOptional()
  solicitante?: string;

  @IsString()
  @IsOptional()
  departamento?: string;
}
