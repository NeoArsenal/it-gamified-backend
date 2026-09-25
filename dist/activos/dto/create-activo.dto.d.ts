import { EstadoActivo } from '../entities/activo.entity.js';
export declare class CreateActivoDto {
    codigo: string;
    tipo: string;
    estado?: EstadoActivo;
    marca?: string;
    modelo?: string;
    numeroSerie?: string;
    codigoFactura?: string;
    sede?: string;
    departamento?: string;
    ubicacion?: string;
    responsable?: string;
    observaciones?: string;
}
