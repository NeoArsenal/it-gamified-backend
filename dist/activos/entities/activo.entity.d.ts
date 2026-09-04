export declare enum EstadoActivo {
    REPARACION = "REPARACION",
    BAJA = "BAJA",
    RESCATADO = "RESCATADO"
}
export declare class Activo {
    id: string;
    codigo: string;
    tipo: string;
    estado: EstadoActivo;
    observaciones: string;
    fechaRegistro: Date;
    fechaActualizacion: Date;
}
