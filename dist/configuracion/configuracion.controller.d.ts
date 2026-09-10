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
    setPortalPin(pin: string): Promise<{
        success: boolean;
    }>;
}
