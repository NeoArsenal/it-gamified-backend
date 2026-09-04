import type { Usuario } from '../../usuarios/entities/usuario.entity.js';
import type { Relation } from 'typeorm';
export declare enum EstadoTicket {
    ABIERTO = "ABIERTO",
    EN_PROGRESO = "EN_PROGRESO",
    RESUELTO = "RESUELTO",
    CERRADO = "CERRADO"
}
export declare enum PrioridadTicket {
    BAJA = "BAJA",
    MEDIA = "MEDIA",
    ALTA = "ALTA",
    CRITICA = "CRITICA"
}
export declare const XP_POR_PRIORIDAD: Record<PrioridadTicket, number>;
export declare class Ticket {
    id: string;
    titulo: string;
    descripcion: string;
    estado: EstadoTicket;
    prioridad: PrioridadTicket;
    xpRecompensa: number;
    asignadoA: Relation<Usuario>;
    asignadoAId: string;
    solicitante: string;
    departamento: string;
    creadoEn: Date;
    resueltoEn: Date;
    actualizadoEn: Date;
}
