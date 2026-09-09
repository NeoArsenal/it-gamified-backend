import type { Relation } from 'typeorm';
export declare class ProgresoUsuario {
    id: string;
    usuario: Relation<any>;
    usuarioId: string;
    nivel: Relation<any>;
    nivelId: string;
    completado: boolean;
    puntajeMaximo: number;
    fechaCompletado: Date;
}
