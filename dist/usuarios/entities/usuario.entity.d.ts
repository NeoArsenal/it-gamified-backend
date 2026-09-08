import type { Ticket } from '../../tickets/entities/ticket.entity.js';
import type { HistorialXP } from '../../gamificacion/entities/historial-xp.entity.js';
import type { UsuarioMedalla } from '../../gamificacion/entities/usuario-medalla.entity.js';
import type { Guia } from '../../guias/entities/guia.entity.js';
import type { Relation } from 'typeorm';
export declare enum RolUsuario {
    ADMIN = "ADMIN",
    TECNICO = "TECNICO"
}
export declare class Usuario {
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
    tickets: Relation<Ticket[]>;
    historialXP: Relation<HistorialXP[]>;
    medallas: Relation<UsuarioMedalla[]>;
    guias: Relation<Guia[]>;
    creadoEn: Date;
    actualizadoEn: Date;
}
