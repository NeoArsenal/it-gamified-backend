import { ConfiguracionService } from './configuracion.service.js';
export declare class ConfiguracionController {
    private readonly configuracionService;
    constructor(configuracionService: ConfiguracionService);
    verifyAccess(pin?: string, token?: string): Promise<{
        valid: boolean;
    }>;
    verifyPin(pin: string): Promise<{
        valid: boolean;
    }>;
    getPortalConfig(): Promise<{
        pin: string;
        token: string;
    }>;
    getPortalPin(): Promise<{
        pin: string;
    }>;
    setPortalPin(pin: string, req: any): Promise<{
        success: boolean;
    }>;
    regeneratePortalToken(req: any): Promise<{
        token: string;
    }>;
    getCatalogos(): Promise<{
        departamentos: string[];
        categoriasActivos: string[];
    }>;
    setCatalogo(tipo: 'departamentos' | 'categoriasActivos', items: string[], req: any): Promise<string[]>;
}
