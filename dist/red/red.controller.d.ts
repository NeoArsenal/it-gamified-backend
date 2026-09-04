import { RedService } from './red.service.js';
export declare class RedController {
    private readonly redService;
    constructor(redService: RedService);
    findAllDispositivos(): Promise<import("./entities/dispositivo-red.entity.js").DispositivoRed[]>;
    findDispositivo(id: string): Promise<import("./entities/dispositivo-red.entity.js").DispositivoRed>;
    createDispositivo(data: any): Promise<import("./entities/dispositivo-red.entity.js").DispositivoRed>;
    updateDispositivo(id: string, data: any): Promise<import("./entities/dispositivo-red.entity.js").DispositivoRed>;
    findAllIPs(): Promise<import("./entities/direccion-ip.entity.js").DireccionIP[]>;
    asignarIP(ip: string, dispositivoId: string): Promise<import("./entities/direccion-ip.entity.js").DireccionIP>;
    liberarIP(ip: string): Promise<import("./entities/direccion-ip.entity.js").DireccionIP>;
}
