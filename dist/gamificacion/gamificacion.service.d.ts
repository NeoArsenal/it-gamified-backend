import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from '../usuarios/entities/usuario.entity.js';
import { Medalla } from './entities/medalla.entity.js';
import { HistorialXP, AccionXP } from './entities/historial-xp.entity.js';
import { UsuarioMedalla } from './entities/usuario-medalla.entity.js';
export declare class GamificacionService {
    private readonly usuarioRepo;
    private readonly historialRepo;
    private readonly medallaRepo;
    private readonly umRepo;
    private readonly logger;
    constructor(usuarioRepo: Repository<Usuario>, historialRepo: Repository<HistorialXP>, medallaRepo: Repository<Medalla>, umRepo: Repository<UsuarioMedalla>);
    otorgarXP(usuarioId: string, xp: number, accion: AccionXP, descripcion?: string): Promise<{
        xpOtorgado: number;
        nuevoXP: number;
        nivel: number;
    }>;
    private verificarMedallas;
    getLeaderboard(limit?: number): Promise<Usuario[]>;
    getHistorial(usuarioId: string): Promise<HistorialXP[]>;
    getMedallasUsuario(usuarioId: string): Promise<UsuarioMedalla[]>;
    getPerfil(usuarioId: string): Promise<{
        medallas: Medalla[];
        xpParaSiguienteNivel: number;
        progresoNivel: number;
        id: string;
        nombre: string;
        email: string;
        password: string;
        rol: RolUsuario;
        nivel: number;
        xpActual: number;
        avatar: string;
        tituloRPG: string;
        preferencias: any;
        modulosAccesibles: string[];
        tickets: import("typeorm").Relation<import("../tickets/entities/ticket.entity.js").Ticket[]>;
        historialXP: import("typeorm").Relation<HistorialXP[]>;
        guias: import("typeorm").Relation<import("../guias/entities/guia.entity.js").Guia[]>;
        creadoEn: Date;
        actualizadoEn: Date;
    }>;
}
