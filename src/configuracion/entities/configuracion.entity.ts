import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Configuracion {
  @PrimaryColumn()
  clave: string;

  @Column()
  valor: string;
}
