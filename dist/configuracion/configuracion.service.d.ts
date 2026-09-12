import { Repository } from 'typeorm';
import { Configuracion } from './entities/configuracion.entity.js';
export declare class ConfiguracionService {
    private configRepo;
    constructor(configRepo: Repository<Configuracion>);
    getValue(clave: string, defaultValue?: string): Promise<string>;
    setValue(clave: string, valor: string, usuarioId?: string): Promise<Configuracion>;
    getPortalToken(): Promise<string>;
    regeneratePortalToken(usuarioId?: string): Promise<string>;
    verifyAccess(pin?: string, token?: string): Promise<boolean>;
    verifyPin(pin: string): Promise<boolean>;
    getCatalogos(): Promise<{
        departamentos: string[];
        categoriasActivos: string[];
    }>;
    setCatalogo(tipo: 'departamentos' | 'categoriasActivos', items: string[], usuarioId?: string): Promise<string[]>;
}
