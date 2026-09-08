import { Activo } from './activo.entity.js';
import type { Relation } from 'typeorm';
export declare class Intervencion {
    id: string;
    descripcion: string;
    tecnicoId: string;
    activo: Relation<Activo>;
    activoId: string;
    fecha: Date;
}
