import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Curso } from './curso.entity.js';
import { Pregunta } from './pregunta.entity.js';
import type { Relation } from 'typeorm';

@Entity('niveles_academia')
export class NivelAcademia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  descripcion: string;

  @Column({ default: 1 })
  orden: number;

  @Column({ default: 50 })
  xpRecompensa: number;

  @Column()
  cursoId: string;

  @ManyToOne('Curso', (curso: any) => curso.niveles)
  curso: Relation<Curso>;

  @OneToMany('Pregunta', (pregunta: any) => pregunta.nivel)
  preguntas: Relation<Pregunta[]>;
}
