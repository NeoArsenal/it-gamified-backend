import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

import type { Relation } from 'typeorm';

@Entity('progreso_academia')
export class ProgresoUsuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Usuario', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Relation<any>;

  @Column()
  usuarioId: string;

  @ManyToOne('NivelAcademia', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nivelId' })
  nivel: Relation<any>;

  @Column()
  nivelId: string;

  @Column({ default: false })
  completado: boolean;

  @Column({ default: 0 })
  puntajeMaximo: number;

  @CreateDateColumn()
  fechaCompletado: Date;
}
