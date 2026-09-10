import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ubicaciones')
export class Ubicacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sede: string;

  @Column()
  departamento: string;

  @Column()
  area: string;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;
}
