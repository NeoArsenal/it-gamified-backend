import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { DispositivoRed } from './dispositivo-red.entity.js';
import type { Relation } from 'typeorm';

export enum EstadoIP {
  LIBRE = 'LIBRE',
  OCUPADA = 'OCUPADA',
  RESERVADA = 'RESERVADA',
}

@Entity('direcciones_ip')
export class DireccionIP {
  @PrimaryColumn()
  ip: string;

  @Column({ nullable: true })
  vlan: string;

  @Column({ type: 'varchar', default: EstadoIP.LIBRE })
  estado: EstadoIP;

  @ManyToOne('DispositivoRed', (d: any) => d.direccionesIP, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'dispositivoId' })
  dispositivo: Relation<DispositivoRed>;

  @Column({ nullable: true })
  dispositivoId: string;
}
