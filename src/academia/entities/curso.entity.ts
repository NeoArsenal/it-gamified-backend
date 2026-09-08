import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { NivelAcademia } from './nivel-academia.entity.js';
import type { Relation } from 'typeorm';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  descripcion: string;

  @Column()
  icono: string;

  @Column({ default: 1 })
  orden: number;

  @OneToMany('NivelAcademia', (nivel: any) => nivel.curso)
  niveles: Relation<NivelAcademia[]>;
}
