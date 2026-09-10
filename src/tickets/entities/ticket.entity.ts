import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { Usuario } from '../../usuarios/entities/usuario.entity.js';
import type { Relation } from 'typeorm';

export enum EstadoTicket {
  ABIERTO = 'ABIERTO',
  EN_PROGRESO = 'EN_PROGRESO',
  RESUELTO = 'RESUELTO',
  CERRADO = 'CERRADO',
}

export enum PrioridadTicket {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  CRITICA = 'CRITICA',
}

/** Mapeo de prioridad a recompensa XP */
export const XP_POR_PRIORIDAD: Record<PrioridadTicket, number> = {
  [PrioridadTicket.BAJA]: 50,
  [PrioridadTicket.MEDIA]: 150,
  [PrioridadTicket.ALTA]: 500,
  [PrioridadTicket.CRITICA]: 1000,
};

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', default: EstadoTicket.ABIERTO })
  estado: EstadoTicket;

  @Column({ type: 'varchar', default: PrioridadTicket.MEDIA })
  prioridad: PrioridadTicket;

  @Column({ default: 150 })
  xpRecompensa: number;

  @ManyToOne('Usuario', (u: any) => u.tickets, { nullable: true, eager: true })
  @JoinColumn({ name: 'asignadoAId' })
  asignadoA: Relation<Usuario>;

  @Column({ nullable: true })
  asignadoAId: string;

  @Column({ nullable: true })
  solicitante: string;
  
  @Column({ nullable: true, default: 'General' })
  departamento: string;

  @Column({ nullable: true })
  sede: string;

  @Column({ nullable: true })
  ubicacionEspecifica: string;

  // Nuevos campos para Kiosco/Portal de auto-servicio
  @Column({ nullable: true })
  solicitanteNombre: string;

  @Column({ nullable: true })
  solicitanteContacto: string;

  @CreateDateColumn()
  creadoEn: Date;

  @Column({ nullable: true })
  resueltoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;
}
