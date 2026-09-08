import { Curso } from './curso.entity.js';
import { Pregunta } from './pregunta.entity.js';
import type { Relation } from 'typeorm';
export declare class NivelAcademia {
    id: string;
    titulo: string;
    descripcion: string;
    orden: number;
    xpRecompensa: number;
    cursoId: string;
    curso: Relation<Curso>;
    preguntas: Relation<Pregunta[]>;
}
