import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './entities/curso.entity.js';
import { NivelAcademia } from './entities/nivel-academia.entity.js';
import { Pregunta } from './entities/pregunta.entity.js';
import { ProgresoUsuario } from './entities/progreso-usuario.entity.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
import { AccionXP } from '../gamificacion/entities/historial-xp.entity.js';

@Injectable()
export class AcademiaService implements OnModuleInit {
  private readonly logger = new Logger(AcademiaService.name);

  constructor(
    @InjectRepository(Curso) private cursoRepo: Repository<Curso>,
    @InjectRepository(NivelAcademia) private nivelRepo: Repository<NivelAcademia>,
    @InjectRepository(Pregunta) private preguntaRepo: Repository<Pregunta>,
    @InjectRepository(ProgresoUsuario) private progresoRepo: Repository<ProgresoUsuario>,
    private gamificacionService: GamificacionService,
  ) {}

  async onModuleInit() {
    await this.seedDatos();
  }

  async getCursos(usuarioId: string) {
    const cursos = await this.cursoRepo.find({
      relations: { niveles: true },
      order: { orden: 'ASC', niveles: { orden: 'ASC' } }
    });

    const progresos = await this.progresoRepo.find({ where: { usuarioId } });
    const completados = new Set(progresos.filter(p => p.completado).map(p => p.nivelId));

    // Mapear cursos para añadir el estado (bloqueado/desbloqueado)
    return cursos.map(curso => {
      let isNivelPrevioCompletado = true; // El primer nivel siempre está desbloqueado
      
      const nivelesConEstado = curso.niveles.map(nivel => {
        const isCompleted = completados.has(nivel.id);
        const isUnlocked = isNivelPrevioCompletado;
        
        // El siguiente nivel solo se desbloquea si este está completado
        isNivelPrevioCompletado = isCompleted;

        return {
          ...nivel,
          isCompleted,
          isUnlocked
        };
      });

      return {
        ...curso,
        niveles: nivelesConEstado
      };
    });
  }

  async getNivelConPreguntas(nivelId: string) {
    return this.nivelRepo.findOne({
      where: { id: nivelId },
      relations: { preguntas: true }
    });
  }

  async completarNivel(usuarioId: string, nivelId: string) {
    const nivel = await this.nivelRepo.findOneByOrFail({ id: nivelId });
    
    let progreso = await this.progresoRepo.findOne({ where: { usuarioId, nivelId } });
    
    // Si ya lo había completado antes, no le damos más XP
    if (progreso && progreso.completado) {
      return { success: true, xpOtorgado: 0, mensaje: 'Nivel ya completado anteriormente.' };
    }

    if (!progreso) {
      progreso = this.progresoRepo.create({ usuarioId, nivelId });
    }
    
    progreso.completado = true;
    await this.progresoRepo.save(progreso);

    // Otorgar XP
    const resultado = await this.gamificacionService.otorgarXP(
      usuarioId,
      nivel.xpRecompensa,
      AccionXP.CURSO_COMPLETADO,
      `Completó el nivel de Academia: ${nivel.titulo}`
    );

    return { success: true, xpOtorgado: resultado.xpOtorgado, nuevoXP: resultado.nuevoXP, nivel: resultado.nivel };
  }

  private async seedDatos() {
    // Si ya hay 100+ preguntas, el seed está completo
    const preguntaCount = await this.preguntaRepo.count();
    if (preguntaCount >= 100) return;

    // Borrar datos anteriores para regenerar completo
    this.logger.log('🎓 Regenerando curso completo de Redes (10 niveles, 100 preguntas)...');
    await this.preguntaRepo.createQueryBuilder().delete().execute();
    await this.progresoRepo.createQueryBuilder().delete().execute();
    await this.nivelRepo.createQueryBuilder().delete().execute();
    await this.cursoRepo.createQueryBuilder().delete().execute();

    // Importar datos de seed
    const { NIVELES_SEED } = await import('./academia-seed-data.js');

    const curso = this.cursoRepo.create({
      titulo: 'Redes: De Cero a Arquitecto',
      descripcion: 'Domina las redes desde los fundamentos hasta diseñar arquitecturas empresariales.',
      icono: 'Network',
      orden: 1
    });
    await this.cursoRepo.save(curso);

    for (const nivelData of NIVELES_SEED) {
      const nivel = await this.nivelRepo.save(this.nivelRepo.create({
        cursoId: curso.id,
        titulo: nivelData.titulo,
        descripcion: nivelData.descripcion,
        orden: nivelData.orden,
        xpRecompensa: nivelData.xpRecompensa,
      }));

      const preguntas = nivelData.preguntas.map(p => ({
        nivelId: nivel.id,
        texto: p.texto,
        opciones: p.opciones,
        respuestaCorrecta: p.respuestaCorrecta,
        explicacion: p.explicacion,
      }));
      await this.preguntaRepo.save(preguntas);
    }

    this.logger.log('✅ Seed de Academia completado: 10 niveles, 100 preguntas.');
  }
}

