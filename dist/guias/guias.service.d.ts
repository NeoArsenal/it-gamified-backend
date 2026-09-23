import { Repository } from 'typeorm';
import { Guia } from './entities/guia.entity.js';
export declare class GuiasService {
    private readonly guiaRepo;
    constructor(guiaRepo: Repository<Guia>);
    findAll(): Promise<Guia[]>;
    search(query: string): Promise<Guia[]>;
    findOne(id: string): Promise<Guia>;
    create(data: Partial<Guia>): Promise<Guia>;
    remove(id: string): Promise<void>;
}
