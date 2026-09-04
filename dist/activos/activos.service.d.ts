import { Repository } from 'typeorm';
import { Activo } from './entities/activo.entity.js';
import { CreateActivoDto } from './dto/create-activo.dto.js';
import { UpdateActivoDto } from './dto/update-activo.dto.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
export declare class ActivosService {
    private readonly activoRepo;
    private readonly gamificacionService;
    private readonly logger;
    constructor(activoRepo: Repository<Activo>, gamificacionService: GamificacionService);
    findAll(): Promise<Activo[]>;
    findOne(id: string): Promise<Activo>;
    create(dto: CreateActivoDto): Promise<Activo>;
    update(id: string, dto: UpdateActivoDto): Promise<Activo>;
    remove(id: string): Promise<void>;
}
