import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { EstadoActivo } from '../entities/activo.entity.js';

export class UpdateActivoDto {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'El código no puede superar los 50 caracteres' })
  codigo?: string;
  
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'El tipo no puede superar los 50 caracteres' })
  tipo?: string;
  
  @IsOptional()
  @IsEnum(EstadoActivo, { message: 'El estado del activo no es válido' })
  estado?: EstadoActivo;

  @IsOptional()
  @IsString()
  @MaxLength(60, { message: 'La marca no puede superar los 60 caracteres' })
  marca?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80, { message: 'El modelo no puede superar los 80 caracteres' })
  modelo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80, { message: 'El número de serie no puede superar los 80 caracteres' })
  numeroSerie?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60, { message: 'El código de factura no puede superar los 60 caracteres' })
  codigoFactura?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60, { message: 'La sede no puede superar los 60 caracteres' })
  sede?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80, { message: 'El departamento no puede superar los 80 caracteres' })
  departamento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120, { message: 'La ubicación no puede superar los 120 caracteres' })
  ubicacion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'El responsable no puede superar los 100 caracteres' })
  responsable?: string;
  
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Las observaciones no pueden superar los 1000 caracteres' })
  observaciones?: string;
  
  @IsOptional()
  @IsString()
  tecnicoId?: string;
}
