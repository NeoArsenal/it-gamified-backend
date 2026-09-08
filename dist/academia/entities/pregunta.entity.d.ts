import { NivelAcademia } from './nivel-academia.entity.js';
import type { Relation } from 'typeorm';
export declare class Pregunta {
    id: string;
    texto: string;
    opciones: string[];
    respuestaCorrecta: number;
    explicacion: string;
    nivelId: string;
    nivel: Relation<NivelAcademia>;
}
