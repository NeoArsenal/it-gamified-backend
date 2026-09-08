import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Curso } from './entities/curso.entity.js';
import { NivelAcademia } from './entities/nivel-academia.entity.js';
import { Pregunta } from './entities/pregunta.entity.js';
import { ProgresoUsuario } from './entities/progreso-usuario.entity.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
export declare class AcademiaService implements OnModuleInit {
    private cursoRepo;
    private nivelRepo;
    private preguntaRepo;
    private progresoRepo;
    private gamificacionService;
    private readonly logger;
    constructor(cursoRepo: Repository<Curso>, nivelRepo: Repository<NivelAcademia>, preguntaRepo: Repository<Pregunta>, progresoRepo: Repository<ProgresoUsuario>, gamificacionService: GamificacionService);
    onModuleInit(): Promise<void>;
    getCursos(usuarioId: string): Promise<{
        niveles: {
            isCompleted: boolean;
            isUnlocked: boolean;
            id: string;
            titulo: string;
            descripcion: string;
            orden: number;
            xpRecompensa: number;
            cursoId: string;
            curso: import("typeorm").Relation<Curso>;
            preguntas: import("typeorm").Relation<Pregunta[]>;
        }[];
        id: string;
        titulo: string;
        descripcion: string;
        icono: string;
        orden: number;
    }[]>;
    getNivelConPreguntas(nivelId: string): Promise<NivelAcademia>;
    completarNivel(usuarioId: string, nivelId: string): Promise<{
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
    private seedDatos;
}
