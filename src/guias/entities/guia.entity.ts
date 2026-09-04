import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { Usuario } from '../../usuarios/entities/usuario.entity.js';
import type { Relation } from 'typeorm';

@Entity('guias')
export class Guia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  urlPdf: string;

  @Column({ nullable: true })
  peso: string;

  @ManyToOne('Usuario', (u: any) => u.guias, { eager: true, nullable: true })
  @JoinColumn({ name: 'autorId' })
  autor: Relation<Usuario>;

  @Column({ nullable: true })
  autorId: string;

  @CreateDateColumn()
  fechaSubida: Date;
}
