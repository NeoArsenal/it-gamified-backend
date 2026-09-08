import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity.js';
export declare class UsuariosService {
    private readonly usuarioRepository;
    constructor(usuarioRepository: Repository<Usuario>);
    findAll(): Promise<Usuario[]>;
    findOne(id: string): Promise<Usuario>;
    createUsuario(data: Partial<Usuario>): Promise<Usuario>;
    updateUsuario(id: string, data: Partial<Usuario>): Promise<Usuario>;
    updatePreferencias(id: string, data: {
        avatar?: string;
        tituloRPG?: string;
        preferencias?: any;
    }): Promise<Usuario>;
}
