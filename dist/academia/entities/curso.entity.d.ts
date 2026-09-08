import { NivelAcademia } from './nivel-academia.entity.js';
import type { Relation } from 'typeorm';
export declare class Curso {
    id: string;
    titulo: string;
    descripcion: string;
    icono: string;
    orden: number;
    niveles: Relation<NivelAcademia[]>;
}
