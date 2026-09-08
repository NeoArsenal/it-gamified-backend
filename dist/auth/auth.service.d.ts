import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthService {
    private usuariosRepository;
    private jwtService;
    constructor(usuariosRepository: Repository<Usuario>, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        usuario: Usuario;
        access_token: string;
    }>;
    validateUserToken(userId: string): Promise<Usuario>;
}
