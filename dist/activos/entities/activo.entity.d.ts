import type { Intervencion } from './intervencion.entity.js';
import type { Relation } from 'typeorm';
export declare enum EstadoActivo {
    OPERATIVO = "OPERATIVO",
    REPARACION = "REPARACION",
    BAJA = "BAJA",
    RESCATADO = "RESCATADO"
}
export declare class Activo {
    id: string;
    codigo: string;
    tipo: string;
    estado: EstadoActivo;
    marca: string;
    modelo: string;
    numeroSerie: string;
    sede: string;
    departamento: string;
    ubicacion: string;
    responsable: string;
    observaciones: string;
    registradoPor: Relation<any>;
    registradoPorId: string;
    intervenciones: Relation<Intervencion[]>;
    fechaRegistro: Date;
    fechaActualizacion: Date;
}
