import { Repository, DataSource } from 'typeorm';
import { Usuario } from './entities/usuario.entity.js';
export declare class UsuariosService {
    private readonly usuarioRepository;
    private readonly dataSource;
    constructor(usuarioRepository: Repository<Usuario>, dataSource: DataSource);
    findAll(): Promise<Usuario[]>;
    findOne(id: string): Promise<Usuario>;
    createUsuario(data: Partial<Usuario>): Promise<Usuario>;
    updateUsuario(id: string, data: Partial<Usuario>): Promise<Usuario>;
    updatePreferencias(id: string, data: {
        avatar?: string;
        tituloRPG?: string;
        preferencias?: any;
    }): Promise<Usuario>;
    deleteUsuario(id: string, currentUserId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
