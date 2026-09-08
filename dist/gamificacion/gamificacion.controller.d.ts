import { GamificacionService } from './gamificacion.service.js';
export declare class GamificacionController {
    private readonly gamificacionService;
    constructor(gamificacionService: GamificacionService);
    getLeaderboard(): Promise<import("../usuarios/entities/usuario.entity.js").Usuario[]>;
    getPerfil(id: string): Promise<{
        medallas: import("./entities/medalla.entity.js").Medalla[];
        xpParaSiguienteNivel: number;
        progresoNivel: number;
        id: string;
        nombre: string;
        email: string;
        password: string;
        rol: import("../usuarios/entities/usuario.entity.js").RolUsuario;
        nivel: number;
        xpActual: number;
        avatar: string;
        tituloRPG: string;
        preferencias: any;
        modulosAccesibles: string[];
        tickets: import("typeorm").Relation<import("../tickets/entities/ticket.entity.js").Ticket[]>;
        historialXP: import("typeorm").Relation<import("./entities/historial-xp.entity.js").HistorialXP[]>;
        guias: import("typeorm").Relation<import("../guias/entities/guia.entity.js").Guia[]>;
        creadoEn: Date;
        actualizadoEn: Date;
    }>;
    getHistorial(userId: string): Promise<import("./entities/historial-xp.entity.js").HistorialXP[]>;
    getMedallas(userId: string): Promise<import("./entities/usuario-medalla.entity.js").UsuarioMedalla[]>;
}
