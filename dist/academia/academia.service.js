var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AcademiaService_1;
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './entities/curso.entity.js';
import { NivelAcademia } from './entities/nivel-academia.entity.js';
import { Pregunta } from './entities/pregunta.entity.js';
import { ProgresoUsuario } from './entities/progreso-usuario.entity.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
import { AccionXP } from '../gamificacion/entities/historial-xp.entity.js';
let AcademiaService = AcademiaService_1 = class AcademiaService {
    cursoRepo;
    nivelRepo;
    preguntaRepo;
    progresoRepo;
    gamificacionService;
    logger = new Logger(AcademiaService_1.name);
    constructor(cursoRepo, nivelRepo, preguntaRepo, progresoRepo, gamificacionService) {
        this.cursoRepo = cursoRepo;
        this.nivelRepo = nivelRepo;
        this.preguntaRepo = preguntaRepo;
        this.progresoRepo = progresoRepo;
        this.gamificacionService = gamificacionService;
    }
    async onModuleInit() {
        await this.seedDatos();
    }
    async getCursos(usuarioId) {
        const cursos = await this.cursoRepo.find({
            relations: { niveles: true },
            order: { orden: 'ASC', niveles: { orden: 'ASC' } }
        });
        const progresos = await this.progresoRepo.find({ where: { usuarioId } });
        const completados = new Set(progresos.filter(p => p.completado).map(p => p.nivelId));
        return cursos.map(curso => {
            let isNivelPrevioCompletado = true;
            const nivelesConEstado = curso.niveles.map(nivel => {
                const isCompleted = completados.has(nivel.id);
                const isUnlocked = isNivelPrevioCompletado;
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
    async getNivelConPreguntas(nivelId) {
        return this.nivelRepo.findOne({
            where: { id: nivelId },
            relations: { preguntas: true }
        });
    }
    async completarNivel(usuarioId, nivelId) {
        const nivel = await this.nivelRepo.findOneByOrFail({ id: nivelId });
        let progreso = await this.progresoRepo.findOne({ where: { usuarioId, nivelId } });
        if (progreso && progreso.completado) {
            return { success: true, xpOtorgado: 0, mensaje: 'Nivel ya completado anteriormente.' };
        }
        if (!progreso) {
            progreso = this.progresoRepo.create({ usuarioId, nivelId });
        }
        progreso.completado = true;
        await this.progresoRepo.save(progreso);
        const resultado = await this.gamificacionService.otorgarXP(usuarioId, nivel.xpRecompensa, AccionXP.CURSO_COMPLETADO, `Completó el nivel de Academia: ${nivel.titulo}`);
        return { success: true, xpOtorgado: resultado.xpOtorgado, nuevoXP: resultado.nuevoXP, nivel: resultado.nivel };
    }
    async seedDatos() {
        const preguntaCount = await this.preguntaRepo.count();
        if (preguntaCount >= 100)
            return;
        this.logger.log('🎓 Regenerando curso completo de Redes (10 niveles, 100 preguntas)...');
        await this.preguntaRepo.createQueryBuilder().delete().execute();
        await this.progresoRepo.createQueryBuilder().delete().execute();
        await this.nivelRepo.createQueryBuilder().delete().execute();
        await this.cursoRepo.createQueryBuilder().delete().execute();
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
};
AcademiaService = AcademiaService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Curso)),
    __param(1, InjectRepository(NivelAcademia)),
    __param(2, InjectRepository(Pregunta)),
    __param(3, InjectRepository(ProgresoUsuario)),
    __metadata("design:paramtypes", [Repository,
        Repository,
        Repository,
        Repository,
        GamificacionService])
], AcademiaService);
export { AcademiaService };
//# sourceMappingURL=academia.service.js.map