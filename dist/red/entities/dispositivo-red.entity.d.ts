import type { DireccionIP } from './direccion-ip.entity.js';
import type { Relation } from 'typeorm';
export declare enum TipoDispositivo {
    SWITCH = "SWITCH",
    ROUTER = "ROUTER",
    ACCESS_POINT = "ACCESS_POINT",
    SERVIDOR = "SERVIDOR"
}
export declare enum EstadoDispositivo {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    WARNING = "WARNING"
}
export declare class DispositivoRed {
    id: string;
    nombre: string;
    tipo: TipoDispositivo;
    estado: EstadoDispositivo;
    ubicacion: string;
    ipAdministracion: string;
    direccionesIP: Relation<DireccionIP[]>;
    ultimoPing: Date;
    registradoPor: Relation<any>;
    registradoPorId: string;
    creadoEn: Date;
    actualizadoEn: Date;
}
