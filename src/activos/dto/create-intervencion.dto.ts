import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateIntervencionDto {
  @IsString()
  @IsNotEmpty({ message: 'La descripción de la intervención es obligatoria' })
  @MaxLength(500, { message: 'La descripción no puede superar los 500 caracteres' })
  descripcion: string;

  @IsOptional()
  @IsString()
  tecnicoId?: string;
}
