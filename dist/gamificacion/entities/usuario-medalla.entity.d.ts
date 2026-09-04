import type { Usuario } from '../../usuarios/entities/usuario.entity.js';
import { Medalla } from './medalla.entity.js';
import type { Relation } from 'typeorm';
export declare class UsuarioMedalla {
    id: string;
    usuario: Relation<Usuario>;
    usuarioId: string;
    medalla: Medalla;
    medallaId: string;
    desbloqueadoEn: Date;
}
