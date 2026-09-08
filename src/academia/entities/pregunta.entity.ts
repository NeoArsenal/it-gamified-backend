import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { NivelAcademia } from './nivel-academia.entity.js';
import type { Relation } from 'typeorm';

@Entity('preguntas_academia')
export class Pregunta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  texto: string;

  @Column({ type: 'json' })
  opciones: string[];

  @Column()
  respuestaCorrecta: number; // Índice de la opción correcta (0, 1, 2, 3)

  @Column({ nullable: true })
  explicacion: string;

  @Column()
  nivelId: string;

  @ManyToOne('NivelAcademia', (nivel: any) => nivel.preguntas)
  nivel: Relation<NivelAcademia>;
}
