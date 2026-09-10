import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUbicacionDto {
  @IsString()
  @IsNotEmpty()
  sede: string;

  @IsString()
  @IsNotEmpty()
  departamento: string;

  @IsString()
  @IsNotEmpty()
  area: string;
}
