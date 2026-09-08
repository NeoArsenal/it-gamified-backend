import type { Usuario } from '../../usuarios/entities/usuario.entity.js';
import type { Relation } from 'typeorm';
export declare enum AccionXP {
    TICKET_RESUELTO = "TICKET_RESUELTO",
    GUIA_SUBIDA = "GUIA_SUBIDA",
    MISION_COMPLETADA = "MISION_COMPLETADA",
    BONUS_ADMIN = "BONUS_ADMIN",
    EQUIPO_RESTAURADO = "EQUIPO_RESTAURADO",
    CURSO_COMPLETADO = "CURSO_COMPLETADO"
}
export declare class HistorialXP {
    id: string;
    usuario: Relation<Usuario>;
    usuarioId: string;
    accion: AccionXP;
    descripcion: string;
    xpOtorgado: number;
    fecha: Date;
}
