import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_GAMIFIED_KEY', // TODO: Mover a variables de entorno (.env)
    });
  }

  async validate(payload: any) {
    const { sub: id } = payload;
    const user = await this.usuariosRepository.findOne({ where: { id } });

    if (!user) {
      throw new UnauthorizedException('Token no válido o usuario no existe');
    }

    return user;
  }
}
