import { AcademiaService } from './academia.service.js';
export declare class AcademiaController {
    private readonly academiaService;
    constructor(academiaService: AcademiaService);
    getCursos(userId: string): Promise<{
        niveles: {
            isCompleted: boolean;
            isUnlocked: boolean;
            id: string;
            titulo: string;
            descripcion: string;
            orden: number;
            xpRecompensa: number;
            cursoId: string;
            curso: import("typeorm").Relation<import("./entities/curso.entity.js").Curso>;
            preguntas: import("typeorm").Relation<import("./entities/pregunta.entity.js").Pregunta[]>;
        }[];
        id: string;
        titulo: string;
        descripcion: string;
        icono: string;
        orden: number;
    }[]>;
    getNivelConPreguntas(id: string): Promise<import("./entities/nivel-academia.entity.js").NivelAcademia>;
    completarNivel(body: {
        userId: string;
        nivelId: string;
    }): Promise<{
        success: boolean;
        xpOtorgado: number;
        mensaje: string;
        nuevoXP?: undefined;
        nivel?: undefined;
    } | {
        success: boolean;
        xpOtorgado: number;
        nuevoXP: number;
        nivel: number;
        mensaje?: undefined;
    }>;
}
