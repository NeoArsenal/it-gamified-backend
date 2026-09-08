import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import type { Ticket } from '../../tickets/entities/ticket.entity.js';
import type { HistorialXP } from '../../gamificacion/entities/historial-xp.entity.js';
import type { UsuarioMedalla } from '../../gamificacion/entities/usuario-medalla.entity.js';
import type { Guia } from '../../guias/entities/guia.entity.js';
import type { Relation } from 'typeorm';

export enum RolUsuario {
  ADMIN = 'ADMIN',
  TECNICO = 'TECNICO',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'varchar', default: RolUsuario.TECNICO })
  rol: RolUsuario;

  @Column({ default: 1 })
  nivel: number;

  @Column({ default: 0 })
  xpActual: number;

  @Column({ default: '' })
  avatar: string;

  @Column({ nullable: true })
  tituloRPG: string;

  @Column({ type: 'json', nullable: true })
  preferencias: any;

  @Column({ type: 'simple-array', nullable: true })
  modulosAccesibles: string[];

  @OneToMany('Ticket', (ticket: any) => ticket.asignadoA)
  tickets: Relation<Ticket[]>;

  @OneToMany('HistorialXP', (h: any) => h.usuario)
  historialXP: Relation<HistorialXP[]>;

  @OneToMany('UsuarioMedalla', (um: any) => um.usuario)
  medallas: Relation<UsuarioMedalla[]>;

  @OneToMany('Guia', (g: any) => g.autor)
  guias: Relation<Guia[]>;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;
}
