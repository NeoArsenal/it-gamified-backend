import { Repository } from 'typeorm';
import { Configuracion } from './entities/configuracion.entity.js';
export declare class ConfiguracionService {
    private configRepo;
    constructor(configRepo: Repository<Configuracion>);
    getValue(clave: string, defaultValue?: string): Promise<string>;
    setValue(clave: string, valor: string): Promise<Configuracion>;
    verifyPin(pin: string): Promise<boolean>;
}
