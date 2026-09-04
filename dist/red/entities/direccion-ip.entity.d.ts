import type { DispositivoRed } from './dispositivo-red.entity.js';
import type { Relation } from 'typeorm';
export declare enum EstadoIP {
    LIBRE = "LIBRE",
    OCUPADA = "OCUPADA",
    RESERVADA = "RESERVADA"
}
export declare class DireccionIP {
    ip: string;
    vlan: string;
    estado: EstadoIP;
    dispositivo: Relation<DispositivoRed>;
    dispositivoId: string;
}
