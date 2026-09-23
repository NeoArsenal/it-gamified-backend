import { Repository, DataSource } from 'typeorm';
import { Usuario } from './entities/usuario.entity.js';
import { StorageService } from '../storage/storage.service.js';
export declare class UsuariosService {
    private readonly usuarioRepository;
    private readonly storageService;
    private readonly dataSource;
    private readonly logger;
    constructor(usuarioRepository: Repository<Usuario>, storageService: StorageService, dataSource: DataSource);
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
