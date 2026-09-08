import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activo, EstadoActivo } from './entities/activo.entity.js';
import { Intervencion } from './entities/intervencion.entity.js';
import { CreateActivoDto } from './dto/create-activo.dto.js';
import { UpdateActivoDto } from './dto/update-activo.dto.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
import { AccionXP } from '../gamificacion/entities/historial-xp.entity.js';

@Injectable()
export class ActivosService {
  private readonly logger = new Logger(ActivosService.name);

  constructor(
    @InjectRepository(Activo)
    private readonly activoRepo: Repository<Activo>,
    @InjectRepository(Intervencion)
    private readonly intervencionRepo: Repository<Intervencion>,
    private readonly gamificacionService: GamificacionService,
  ) {}

  async findAll() {
    return this.activoRepo.find({ order: { fechaRegistro: 'DESC' } });
  }

  async findOne(id: string) {
    let activo;
    if (id.length < 36) {
      // Soportar short IDs (ej. escaneos parciales o ingresos manuales) o búsqueda por código
      activo = await this.activoRepo.createQueryBuilder('activo')
        .leftJoinAndSelect('activo.intervenciones', 'intervenciones')
        .where('activo.id LIKE :id', { id: `${id}%` })
        .orWhere('activo.codigo = :codigo', { codigo: id })
        .getOne();
    } else {
      activo = await this.activoRepo.findOne({
        where: { id },
        relations: { intervenciones: true }
      });
    }

    if (!activo) throw new NotFoundException(`Activo ${id} no encontrado`);
    return activo;
  }

  async create(dto: CreateActivoDto) {
    const activo = this.activoRepo.create({
      ...dto,
      estado: dto.estado as EstadoActivo || EstadoActivo.REPARACION
    });
    return this.activoRepo.save(activo);
  }

  async update(id: string, dto: UpdateActivoDto) {
    const activo = await this.findOne(id);
    const estadoAnterior = activo.estado;
    
    Object.assign(activo, dto);
    const saved = await this.activoRepo.save(activo);

    // Gamificacin: Si el estado cambia a RESCATADO, dar XP al tcnico (userId opcional que viene en el DTO para el prototipo)
    if (dto.estado === EstadoActivo.RESCATADO && estadoAnterior !== EstadoActivo.RESCATADO && dto.tecnicoId) {
      const xpRecompensa = 1000; // Bonus enorme por ahorrar dinero
      const res = await this.gamificacionService.otorgarXP(
        dto.tecnicoId,
        xpRecompensa,
        AccionXP.BONUS_ADMIN,
        `Rescató el equipo ${activo.codigo} de la chatarra`
      );
      this.logger.log(`s +${xpRecompensa} XP a ${dto.tecnicoId} por rescatar equipo ${activo.codigo}`);
    }

    return saved;
  }

  async remove(id: string) {
    const activo = await this.findOne(id);
    await this.activoRepo.remove(activo);
  }

  async addIntervencion(id: string, descripcion: string, tecnicoId?: string) {
    const activo = await this.findOne(id);
    const intervencion = this.intervencionRepo.create({
      descripcion,
      tecnicoId,
      activo
    });
    return this.intervencionRepo.save(intervencion);
  }
}
