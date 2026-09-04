import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('medallas')
export class Medalla {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ default: '🏆' })
  icono: string;

  @Column({ default: 0 })
  condicionXP: number;
}
