import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import { LoginDto } from './dto/login.dto.js';

interface AccountLockRecord {
  failedCount: number;
  lockedUntil?: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger('Auth-Security');
  private readonly accountLocks = new Map<string, AccountLockRecord>();

  // Configuración de bloqueo de cuenta
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly ACCOUNT_LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutos de bloqueo

  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, clientIp = 'unknown') {
    const emailKey = loginDto.email.trim().toLowerCase();
    const now = Date.now();

    // 1. Verificar si la cuenta está en bloqueo por intentos fallidos
    const lockRecord = this.accountLocks.get(emailKey);
    if (lockRecord?.lockedUntil && now < lockRecord.lockedUntil) {
      const remainingMinutes = Math.ceil((lockRecord.lockedUntil - now) / (60 * 1000));
      this.logger.warn(`🔒 [CUENTA BLOQUEADA] Intento de acceso a "${emailKey}" desde IP: ${clientIp} mientras está bloqueada.`);
      throw new UnauthorizedException(
        `Esta cuenta ha sido bloqueada temporalmente por seguridad tras múltiples intentos fallidos. Intenta nuevamente en ${remainingMinutes} minuto(s).`
      );
    }

    // 2. Buscar usuario en base de datos
    const user = await this.usuariosRepository.createQueryBuilder('usuario')
      .addSelect('usuario.password')
      .where('LOWER(usuario.email) = :email', { email: emailKey })
      .getOne();

    if (!user) {
      this.registerFailedAttempt(emailKey, clientIp, 'Usuario no existe');
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Comparar contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      this.registerFailedAttempt(emailKey, clientIp, 'Contraseña errónea');
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 4. Éxito: Limpiar historial de intentos fallidos
    this.accountLocks.delete(emailKey);
    this.logger.log(`✅ [ACCESO AUTORIZADO] Usuario: ${user.email} (${user.rol}) | IP: ${clientIp}`);

    // No devolver la contraseña en la respuesta
    delete user.password;

    const payload = { sub: user.id, email: user.email, rol: user.rol };

    return {
      usuario: user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private registerFailedAttempt(email: string, clientIp: string, motivo: string) {
    const now = Date.now();
    const record = this.accountLocks.get(email) || { failedCount: 0 };
    record.failedCount++;

    this.logger.warn(`⚠️ [FALLO DE ACCESO] Email: "${email}" | Motivo: ${motivo} | Intento #${record.failedCount}/${this.MAX_FAILED_ATTEMPTS} | IP: ${clientIp}`);

    if (record.failedCount >= this.MAX_FAILED_ATTEMPTS) {
      record.lockedUntil = now + this.ACCOUNT_LOCKOUT_DURATION_MS;
      this.logger.error(`⛔ [BLOQUEO AUTOMÁTICO] La cuenta "${email}" fue BLOQUEADA por 10 minutos por sospecha de ataque de fuerza bruta | IP atacante: ${clientIp}`);
    }

    this.accountLocks.set(email, record);
  }

  async validateUserToken(userId: string) {
    const user = await this.usuariosRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    return user;
  }
}

