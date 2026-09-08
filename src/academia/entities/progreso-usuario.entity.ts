import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('progreso_academia')
export class ProgresoUsuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  usuarioId: string;

  @Column()
  nivelId: string;

  @Column({ default: false })
  completado: boolean;

  @Column({ default: 0 })
  puntajeMaximo: number;

  @CreateDateColumn()
  fechaCompletado: Date;
}
