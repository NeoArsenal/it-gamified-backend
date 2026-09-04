import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from '../usuarios/entities/usuario.entity.js';
import { Medalla } from './entities/medalla.entity.js';
import { HistorialXP, AccionXP } from './entities/historial-xp.entity.js';
import { UsuarioMedalla } from './entities/usuario-medalla.entity.js';

/** Niveles: XP necesario para alcanzar cada nivel */
const NIVELES = [
  0, 500, 1200, 2000, 3500, 5000, 7500, 10000, 13000, 17000,
  22000, 28000, 35000, 43000, 52000, 62000, 73000, 85000, 100000, 120000,
];

function calcularNivel(xp: number): number {
  for (let i = NIVELES.length - 1; i >= 0; i--) {
    if (xp >= NIVELES[i]) return i + 1;
  }
  return 1;
}

@Injectable()
export class GamificacionService {
  private readonly logger = new Logger(GamificacionService.name);

  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(HistorialXP) private readonly historialRepo: Repository<HistorialXP>,
    @InjectRepository(Medalla) private readonly medallaRepo: Repository<Medalla>,
    @InjectRepository(UsuarioMedalla) private readonly umRepo: Repository<UsuarioMedalla>,
  ) {}

  /** Otorga XP a un usuario, recalcula nivel y verifica medallas */
  async otorgarXP(usuarioId: string, xp: number, accion: AccionXP, descripcion?: string) {
    // 1. Registrar en historial
    const registro = this.historialRepo.create({ usuarioId, xpOtorgado: xp, accion, descripcion });
    await this.historialRepo.save(registro);

    // 2. Sumar XP al usuario
    const usuario = await this.usuarioRepo.findOneByOrFail({ id: usuarioId });
    usuario.xpActual += xp;

    // 3. Recalcular nivel
    const nuevoNivel = calcularNivel(usuario.xpActual);
    if (nuevoNivel > usuario.nivel) {
      this.logger.log(`🎉 ¡${usuario.nombre} subió al nivel ${nuevoNivel}!`);
    }
    usuario.nivel = nuevoNivel;

    await this.usuarioRepo.save(usuario);

    // 4. Verificar medallas desbloqueables
    await this.verificarMedallas(usuario);

    return { xpOtorgado: xp, nuevoXP: usuario.xpActual, nivel: usuario.nivel };
  }

  /** Busca medallas que el usuario aún no tiene pero ya cumple la condición */
  private async verificarMedallas(usuario: Usuario) {
    const todasMedallas = await this.medallaRepo.find();
    const medallasUsuario = await this.umRepo.find({ where: { usuarioId: usuario.id } });
    const idsDesbloqueados = new Set(medallasUsuario.map((um) => um.medallaId));

    for (const medalla of todasMedallas) {
      if (!idsDesbloqueados.has(medalla.id) && usuario.xpActual >= medalla.condicionXP) {
        const nueva = this.umRepo.create({ usuarioId: usuario.id, medallaId: medalla.id });
        await this.umRepo.save(nueva);
        this.logger.log(`🏅 ${usuario.nombre} desbloqueó la medalla "${medalla.nombre}"`);
      }
    }
  }

  /** Obtener el leaderboard (Top N por XP) */
  async getLeaderboard(limit = 10) {
    return this.usuarioRepo.find({
      order: { xpActual: 'DESC' },
      take: limit,
      select: { id: true, nombre: true, email: true, nivel: true, xpActual: true, avatar: true },
    });
  }

  /** Obtener historial XP de un usuario */
  async getHistorial(usuarioId: string) {
    return this.historialRepo.find({
      where: { usuarioId },
      order: { fecha: 'DESC' },
      take: 50,
    });
  }

  /** Obtener medallas de un usuario */
  async getMedallasUsuario(usuarioId: string) {
    return this.umRepo.find({
      where: { usuarioId },
      relations: { medalla: true },
    });
  }

  /** Obtener perfil gamificado completo */
  async getPerfil(usuarioId: string) {
    const usuario = await this.usuarioRepo.findOneByOrFail({ id: usuarioId });
    const medallas = await this.getMedallasUsuario(usuarioId);
    const xpParaSiguienteNivel = usuario.nivel < NIVELES.length ? NIVELES[usuario.nivel] : NIVELES[NIVELES.length - 1];
    const xpNivelActual = NIVELES[usuario.nivel - 1] || 0;
    const progreso = Math.round(((usuario.xpActual - xpNivelActual) / (xpParaSiguienteNivel - xpNivelActual)) * 100);

    return {
      ...usuario,
      medallas: medallas.map((um) => um.medalla),
      xpParaSiguienteNivel,
      progresoNivel: Math.min(progreso, 100),
    };
  }
}
