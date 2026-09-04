import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { Usuario } from '../../usuarios/entities/usuario.entity.js';
import type { Relation } from 'typeorm';

export enum AccionXP {
  TICKET_RESUELTO = 'TICKET_RESUELTO',
  GUIA_SUBIDA = 'GUIA_SUBIDA',
  MISION_COMPLETADA = 'MISION_COMPLETADA',
  BONUS_ADMIN = 'BONUS_ADMIN',
}

@Entity('historial_xp')
export class HistorialXP {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Usuario', (u: any) => u.historialXP, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Relation<Usuario>;

  @Column()
  usuarioId: string;

  @Column({ type: 'varchar' })
  accion: AccionXP;

  @Column({ nullable: true })
  descripcion: string;

  @Column()
  xpOtorgado: number;

  @CreateDateColumn()
  fecha: Date;
}
