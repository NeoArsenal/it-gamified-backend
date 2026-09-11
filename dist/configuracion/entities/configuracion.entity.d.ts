import { Usuario } from '../../usuarios/entities/usuario.entity.js';
export declare class Configuracion {
    clave: string;
    valor: string;
    actualizadoPorId?: string;
    actualizadoPor?: Usuario;
    actualizadoEn: Date;
}
