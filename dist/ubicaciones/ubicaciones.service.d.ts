import { Repository } from 'typeorm';
import { Ubicacion } from './entities/ubicacion.entity.js';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto.js';
export declare class UbicacionesService {
    private ubicacionRepo;
    constructor(ubicacionRepo: Repository<Ubicacion>);
    findAll(): Promise<Ubicacion[]>;
    findSedes(): Promise<string[]>;
    findDepartamentosPorSede(sede: string): Promise<string[]>;
    findAreas(sede: string, departamento: string): Promise<string[]>;
    create(createUbicacionDto: CreateUbicacionDto): Promise<Ubicacion>;
    remove(id: string): Promise<void>;
}
