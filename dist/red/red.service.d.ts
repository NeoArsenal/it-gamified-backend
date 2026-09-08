import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DispositivoRed } from './entities/dispositivo-red.entity.js';
import { DireccionIP } from './entities/direccion-ip.entity.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
export declare class RedService implements OnModuleInit {
    private readonly dispositivoRepo;
    private readonly ipRepo;
    private readonly gamificacionService;
    constructor(dispositivoRepo: Repository<DispositivoRed>, ipRepo: Repository<DireccionIP>, gamificacionService: GamificacionService);
    onModuleInit(): Promise<void>;
    findAllDispositivos(): Promise<DispositivoRed[]>;
    findDispositivo(id: string): Promise<DispositivoRed>;
    createDispositivo(data: Partial<DispositivoRed>): Promise<DispositivoRed>;
    updateDispositivo(id: string, data: Partial<DispositivoRed>): Promise<DispositivoRed>;
    simularCaida(): Promise<DispositivoRed | {
        message: string;
    }>;
    restaurarDispositivo(id: string, tecnicoId: string): Promise<DispositivoRed>;
    findAllIPs(): Promise<DireccionIP[]>;
    registrarIP(data: Partial<DireccionIP>): Promise<DireccionIP>;
    asignarIP(ip: string, dispositivoId: string): Promise<DireccionIP>;
    liberarIP(ip: string): Promise<DireccionIP>;
}
