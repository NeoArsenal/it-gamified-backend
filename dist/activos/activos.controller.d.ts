import { ActivosService } from './activos.service.js';
import { CreateActivoDto } from './dto/create-activo.dto.js';
import { UpdateActivoDto } from './dto/update-activo.dto.js';
export declare class ActivosController {
    private readonly activosService;
    constructor(activosService: ActivosService);
    create(createActivoDto: CreateActivoDto): Promise<import("./entities/activo.entity.js").Activo>;
    findAll(): Promise<import("./entities/activo.entity.js").Activo[]>;
    findOne(id: string): Promise<import("./entities/activo.entity.js").Activo>;
    update(id: string, updateActivoDto: UpdateActivoDto): Promise<import("./entities/activo.entity.js").Activo>;
    remove(id: string): Promise<void>;
}
