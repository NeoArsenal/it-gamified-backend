import { UbicacionesService } from './ubicaciones.service.js';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto.js';
export declare class UbicacionesController {
    private readonly ubicacionesService;
    constructor(ubicacionesService: UbicacionesService);
    create(createUbicacionDto: CreateUbicacionDto): Promise<import("./entities/ubicacion.entity.js").Ubicacion>;
    findAll(): Promise<import("./entities/ubicacion.entity.js").Ubicacion[]>;
    findSedes(): Promise<string[]>;
    findDepartamentos(sede: string): any[] | Promise<string[]>;
    findAreas(sede: string, departamento: string): any[] | Promise<string[]>;
    remove(id: string): Promise<void>;
}
