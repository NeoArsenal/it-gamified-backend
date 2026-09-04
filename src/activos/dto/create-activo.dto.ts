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
  observaciones?: string;
}
