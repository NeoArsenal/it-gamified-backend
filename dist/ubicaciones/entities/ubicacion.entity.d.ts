import { Usuario } from '../../usuarios/entities/usuario.entity.js';
export declare class Ubicacion {
    id: string;
    sede: string;
    departamento: string;
    area: string;
    creadoPorId?: string;
    creadoPor?: Usuario;
    creadoEn: Date;
    actualizadoEn: Date;
}
