import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { PrioridadTicket } from '../entities/ticket.entity.js';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MaxLength(150, { message: 'El título no puede superar los 150 caracteres' })
  titulo: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
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

  @IsString()
  @IsOptional()
  sede?: string;

  @IsString()
  @IsOptional()
  ubicacionEspecifica?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'El nombre del solicitante no puede superar los 50 caracteres' })
  solicitanteNombre?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'El teléfono o anexo no puede superar los 20 caracteres' })
  solicitanteContacto?: string;
}
