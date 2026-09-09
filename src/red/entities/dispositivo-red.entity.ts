import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import type { DireccionIP } from './direccion-ip.entity.js';
import type { Relation } from 'typeorm';

export enum TipoDispositivo {
  SWITCH = 'SWITCH',
  ROUTER = 'ROUTER',
  ACCESS_POINT = 'ACCESS_POINT',
  SERVIDOR = 'SERVIDOR',
}

export enum EstadoDispositivo {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  WARNING = 'WARNING',
}

@Entity('dispositivos_red')
export class DispositivoRed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'varchar', default: TipoDispositivo.SWITCH })
  tipo: TipoDispositivo;

  @Column({ type: 'varchar', default: EstadoDispositivo.ONLINE })
  estado: EstadoDispositivo;

  @Column({ nullable: true })
  ubicacion: string;

  @Column({ nullable: true })
  ipAdministracion: string;

  @OneToMany('DireccionIP', (ip: any) => ip.dispositivo)
  direccionesIP: Relation<DireccionIP[]>;

  @Column({ nullable: true })
  ultimoPing: Date;

  @ManyToOne('Usuario', { nullable: true })
  @JoinColumn({ name: 'registradoPorId' })
  registradoPor: Relation<any>;

  @Column({ nullable: true })
  registradoPorId: string;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;
}
