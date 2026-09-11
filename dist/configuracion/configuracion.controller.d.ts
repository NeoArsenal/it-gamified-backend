import { ConfiguracionService } from './configuracion.service.js';
export declare class ConfiguracionController {
    private readonly configuracionService;
    constructor(configuracionService: ConfiguracionService);
    verifyPin(pin: string): Promise<{
        valid: boolean;
    }>;
    getPortalPin(): Promise<{
        pin: string;
    }>;
    setPortalPin(pin: string, req: any): Promise<{
        success: boolean;
    }>;
    getCatalogos(): Promise<{
        departamentos: string[];
        categoriasActivos: string[];
    }>;
    setCatalogo(tipo: 'departamentos' | 'categoriasActivos', items: string[], req: any): Promise<string[]>;
}
