import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Activo } from './activo.entity.js';
import type { Relation } from 'typeorm';

@Entity('intervenciones')
export class Intervencion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  descripcion: string;

  @ManyToOne('Usuario', { nullable: true })
  @JoinColumn({ name: 'tecnicoId' })
  tecnico: Relation<any>;

  @Column({ nullable: true })
  tecnicoId: string;

  @ManyToOne('Activo', (activo: any) => activo.intervenciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activoId' })
  activo: Relation<Activo>;

  @Column()
  activoId: string;

  @CreateDateColumn()
  fecha: Date;
}
