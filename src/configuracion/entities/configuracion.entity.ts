import { Entity, PrimaryColumn, Column, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity.js';

@Entity('configuracion')
export class Configuracion {
  @PrimaryColumn()
  clave: string;

  @Column()
  valor: string;

  @Column({ nullable: true })
  actualizadoPorId?: string;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'actualizadoPorId' })
  actualizadoPor?: Usuario;

  @UpdateDateColumn()
  actualizadoEn: Date;
}
