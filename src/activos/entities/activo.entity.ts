import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import type { Intervencion } from './intervencion.entity.js';
import type { Relation } from 'typeorm';

export enum EstadoActivo {
  OPERATIVO = 'OPERATIVO',
  REPARACION = 'REPARACION',
  BAJA = 'BAJA',
  RESCATADO = 'RESCATADO'
}

@Entity('activos')
export class Activo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  codigo: string;

  @Column()
  tipo: string;

  @Column({
    type: 'varchar',
    enum: EstadoActivo,
    default: EstadoActivo.OPERATIVO
  })
  estado: EstadoActivo;

  @Column({ nullable: true })
  marca: string;

  @Column({ nullable: true })
  modelo: string;

  @Column({ nullable: true })
  numeroSerie: string;

  @Column({ nullable: true })
  sede: string;

  @Column({ nullable: true })
  departamento: string;

  @Column({ nullable: true })
  ubicacion: string;

  @Column({ nullable: true })
  responsable: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ManyToOne('Usuario', { nullable: true })
  @JoinColumn({ name: 'registradoPorId' })
  registradoPor: Relation<any>;

  @Column({ nullable: true })
  registradoPorId: string;

  @OneToMany('Intervencion', (intervencion: any) => intervencion.activo, { eager: true })
  intervenciones: Relation<Intervencion[]>;

  @CreateDateColumn()
  fechaRegistro: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
