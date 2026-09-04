import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Column } from 'typeorm';
import type { Usuario } from '../../usuarios/entities/usuario.entity.js';
import { Medalla } from './medalla.entity.js';
import type { Relation } from 'typeorm';

@Entity('usuario_medallas')
export class UsuarioMedalla {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne('Usuario', (u: any) => u.medallas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Relation<Usuario>;

  @Column()
  usuarioId: string;

  @ManyToOne(() => Medalla, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medallaId' })
  medalla: Medalla;

  @Column()
  medallaId: string;

  @CreateDateColumn()
  desbloqueadoEn: Date;
}
