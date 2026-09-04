import { Repository } from 'typeorm';
import { DispositivoRed } from './entities/dispositivo-red.entity.js';
import { DireccionIP } from './entities/direccion-ip.entity.js';
export declare class RedService {
    private readonly dispositivoRepo;
    private readonly ipRepo;
    constructor(dispositivoRepo: Repository<DispositivoRed>, ipRepo: Repository<DireccionIP>);
    findAllDispositivos(): Promise<DispositivoRed[]>;
    findDispositivo(id: string): Promise<DispositivoRed>;
    createDispositivo(data: Partial<DispositivoRed>): Promise<DispositivoRed>;
    updateDispositivo(id: string, data: Partial<DispositivoRed>): Promise<DispositivoRed>;
    findAllIPs(): Promise<DireccionIP[]>;
    asignarIP(ip: string, dispositivoId: string): Promise<DireccionIP>;
    liberarIP(ip: string): Promise<DireccionIP>;
}
