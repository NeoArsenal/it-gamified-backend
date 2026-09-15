import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthService {
    private usuariosRepository;
    private jwtService;
    private readonly logger;
    private readonly accountLocks;
    private readonly MAX_FAILED_ATTEMPTS;
    private readonly ACCOUNT_LOCKOUT_DURATION_MS;
    constructor(usuariosRepository: Repository<Usuario>, jwtService: JwtService);
    login(loginDto: LoginDto, clientIp?: string): Promise<{
        usuario: Usuario;
        access_token: string;
    }>;
    private registerFailedAttempt;
    validateUserToken(userId: string): Promise<Usuario>;
}
