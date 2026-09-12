import { UsuariosService } from './usuarios.service.js';
import { Usuario } from './entities/usuario.entity.js';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    findAll(): Promise<Usuario[]>;
    createUsuario(body: Partial<Usuario>): Promise<Usuario>;
    updateUsuario(id: string, body: Partial<Usuario>): Promise<Usuario>;
    deleteUsuario(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    findOne(id: string): Promise<Usuario>;
    updatePreferencias(id: string, body: {
        avatar?: string;
        tituloRPG?: string;
        preferencias?: any;
    }): Promise<Usuario>;
}
