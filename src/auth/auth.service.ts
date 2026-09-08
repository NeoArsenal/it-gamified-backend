import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Obtenemos el usuario incluyendo el password (que tiene select: false por defecto)
    const user = await this.usuariosRepository.createQueryBuilder('usuario')
      .addSelect('usuario.password')
      .where('usuario.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // No queremos devolver el password en la respuesta
    delete user.password;

    const payload = { sub: user.id, email: user.email, rol: user.rol };

    return {
      usuario: user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUserToken(userId: string) {
    const user = await this.usuariosRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    return user;
  }
}
