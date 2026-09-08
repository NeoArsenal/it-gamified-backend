import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        usuario: import("../usuarios/entities/usuario.entity.js").Usuario;
        access_token: string;
    }>;
    getProfile(req: any): any;
}
