import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { Ticket } from './ticket.entity.js';
import type { Usuario } from '../../usuarios/entities/usuario.entity.js';
import type { Relation } from 'typeorm';

export enum TipoAccionHistorial {
  CREADO = 'CREADO',
  CAMBIO_ESTADO = 'CAMBIO_ESTADO',
  CAMBIO_PRIORIDAD = 'CAMBIO_PRIORIDAD',
  ASIGNADO = 'ASIGNADO',
  SOLUCION_REGISTRADA = 'SOLUCION_REGISTRADA',
  CERRADO = 'CERRADO',
  NOTA = 'NOTA',
}

@Entity('tickets_historial')
export class TicketHistorial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ticketId: string;

  @ManyToOne('Ticket', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticketId' })
  ticket: Relation<Ticket>;

  @Column({ nullable: true })
  usuarioId: string;

  @ManyToOne('Usuario', { nullable: true, eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Relation<Usuario>;

  @Column({ nullable: true })
  usuarioNombre: string;

  @Column({ type: 'varchar', default: TipoAccionHistorial.CREADO })
  tipoAccion: TipoAccionHistorial;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  detalles: string;

  @CreateDateColumn()
  creadoEn: Date;
}
