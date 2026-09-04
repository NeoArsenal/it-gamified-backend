import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EstadoActivo {
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
    default: EstadoActivo.REPARACION
  })
  estado: EstadoActivo;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  fechaRegistro: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
