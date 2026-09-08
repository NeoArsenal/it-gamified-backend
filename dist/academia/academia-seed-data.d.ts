export interface PreguntaSeed {
    texto: string;
    opciones: string[];
    respuestaCorrecta: number;
    explicacion: string;
}
export interface NivelSeed {
    titulo: string;
    descripcion: string;
    orden: number;
    xpRecompensa: number;
    preguntas: PreguntaSeed[];
}
export declare const NIVELES_SEED: NivelSeed[];
