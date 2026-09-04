import { IsString, IsOptional } from 'class-validator';

export class UpdateActivoDto {
  @IsOptional()
  @IsString()
  codigo?: string;
  
  @IsOptional()
  @IsString()
  tipo?: string;
  
  @IsOptional()
  @IsString()
  estado?: string;
  
  @IsOptional()
  @IsString()
  observaciones?: string;
  
  @IsOptional()
  @IsString()
  tecnicoId?: string;
}
