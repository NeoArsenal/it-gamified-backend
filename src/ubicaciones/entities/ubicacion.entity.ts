import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity.js';

@Entity('ubicaciones')
export class Ubicacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sede: string;

  @Column()
  departamento: string;

  @Column()
  area: string;

  @Column({ nullable: true })
  creadoPorId?: string;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creadoPorId' })
  creadoPor?: Usuario;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;
}
