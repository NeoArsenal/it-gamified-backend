import { Repository } from 'typeorm';
import { Activo } from './entities/activo.entity.js';
import { Intervencion } from './entities/intervencion.entity.js';
import { CreateActivoDto } from './dto/create-activo.dto.js';
import { UpdateActivoDto } from './dto/update-activo.dto.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
export declare class ActivosService {
    private readonly activoRepo;
    private readonly intervencionRepo;
    private readonly gamificacionService;
    private readonly logger;
    constructor(activoRepo: Repository<Activo>, intervencionRepo: Repository<Intervencion>, gamificacionService: GamificacionService);
    findAll(): Promise<Activo[]>;
    findOne(id: string): Promise<any>;
    create(dto: CreateActivoDto): Promise<Activo>;
    update(id: string, dto: UpdateActivoDto): Promise<any>;
    remove(id: string): Promise<void>;
    addIntervencion(id: string, descripcion: string, tecnicoId?: string): Promise<Intervencion>;
}
