import { IsString, IsOptional } from 'class-validator';

export class CreateActivoDto {
  @IsString()
  codigo: string;
  
  @IsString()
  tipo: string;
  
  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsString()
  sede?: string;

  @IsOptional()
  @IsString()
  departamento?: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsString()
  responsable?: string;
  
  @IsOptional()
  @IsString()
  observaciones?: string;
}

