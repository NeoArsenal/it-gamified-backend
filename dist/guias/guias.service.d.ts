import { Repository } from 'typeorm';
import { Guia } from './entities/guia.entity.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
export declare class GuiasService {
    private readonly guiaRepo;
    private readonly gamificacionService;
    constructor(guiaRepo: Repository<Guia>, gamificacionService: GamificacionService);
    findAll(): Promise<Guia[]>;
    search(query: string): Promise<Guia[]>;
    findOne(id: string): Promise<Guia>;
    create(data: Partial<Guia>): Promise<Guia>;
    remove(id: string): Promise<void>;
}
