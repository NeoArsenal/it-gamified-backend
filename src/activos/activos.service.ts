import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activo, EstadoActivo } from './entities/activo.entity.js';
import { Intervencion } from './entities/intervencion.entity.js';
import { CreateActivoDto } from './dto/create-activo.dto.js';
import { UpdateActivoDto } from './dto/update-activo.dto.js';

@Injectable()
export class ActivosService {
  private readonly logger = new Logger(ActivosService.name);

  constructor(
    @InjectRepository(Activo)
    private readonly activoRepo: Repository<Activo>,
    @InjectRepository(Intervencion)
    private readonly intervencionRepo: Repository<Intervencion>,
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
    const estadoInicial = (dto.estado as EstadoActivo) || EstadoActivo.DISPONIBLE;
    const activo = this.activoRepo.create({
      ...dto,
      estado: estadoInicial,
    });
    const saved = await this.activoRepo.save(activo);

    // 📦 Primer hito de Trazabilidad: Alta en almacén
    const detalleAlta = dto.codigoFactura
      ? `Alta e ingreso a Almacén Central TI · Factura: ${dto.codigoFactura.trim().toUpperCase()}`
      : 'Alta e ingreso a Almacén Central TI (Sin asignar)';
    
    await this.addIntervencion(saved.id, detalleAlta);
    this.logger.log(`📦 Activo "${saved.codigo}" registrado exitosamente (${saved.estado})`);
    return saved;
  }

  async update(id: string, dto: UpdateActivoDto) {
    const activo = await this.findOne(id);
    const estadoAnterior = activo.estado;
    const sedeAnterior = activo.sede;
    const deptoAnterior = activo.departamento;
    const responsableAnterior = activo.responsable;
    
    for (const [key, val] of Object.entries(dto)) {
      if (val !== undefined) {
        (activo as any)[key] = val;
      }
    }
    const saved = await this.activoRepo.save(activo);

    // 📍 Hito de Trazabilidad: Asignación o Traslado de Sede/Responsable
    const huboCambioUbicacion =
      (dto.sede !== undefined && dto.sede !== sedeAnterior) ||
      (dto.departamento !== undefined && dto.departamento !== deptoAnterior) ||
      (dto.responsable !== undefined && dto.responsable !== responsableAnterior);

    if (huboCambioUbicacion) {
      const destino = `${saved.sede || 'Sede General'}${saved.departamento ? ` · ${saved.departamento}` : ''}${saved.ubicacion ? ` (${saved.ubicacion})` : ''}`;
      const resp = saved.responsable ? ` · Responsable: ${saved.responsable}` : '';
      await this.addIntervencion(
        saved.id,
        `📍 Asignación / Traslado operativo a ${destino}${resp}`,
        dto.tecnicoId
      );
    }

    // ⚠️ Hito de Trazabilidad: Cambio de Estado Operativo / Falla / Taller / Baja
    if (dto.estado && dto.estado !== estadoAnterior) {
      let detalleEstado = `Cambio de estado: [${estadoAnterior}] ➔ [${dto.estado}]`;
      if (dto.estado === EstadoActivo.REPARACION) {
        detalleEstado = `🛠️ Ingreso a Taller por desperfecto/falla: ${dto.observaciones || 'Revisión técnica general'}`;
      } else if (dto.estado === EstadoActivo.OPERATIVO && estadoAnterior === EstadoActivo.REPARACION) {
        detalleEstado = `✅ Reparación concluida en Taller: ${dto.observaciones || 'Equipo operativo y devuelto a servicio'}`;
      } else if (dto.estado === EstadoActivo.BAJA) {
        detalleEstado = `🛑 Declarado de Baja / Chatarra: ${dto.observaciones || 'Baja patrimonial definitiva'}`;
      } else if (dto.estado === EstadoActivo.DISPONIBLE) {
        detalleEstado = `📦 Retornado a Almacén Central TI: ${dto.observaciones || 'Disponible para nueva asignación'}`;
      } else if (dto.observaciones) {
        detalleEstado += ` · Diagnóstico: ${dto.observaciones}`;
      }

      await this.addIntervencion(saved.id, detalleEstado, dto.tecnicoId);
    }

    if (dto.estado === EstadoActivo.RESCATADO && estadoAnterior !== EstadoActivo.RESCATADO) {
      this.logger.log(`♻️ Equipo ${activo.codigo} reciclado para piezas/repuestos`);
    }

    if (dto.estado === EstadoActivo.OPERATIVO && estadoAnterior === EstadoActivo.REPARACION) {
      this.logger.log(`🛠️ Equipo ${activo.codigo} reparado con éxito y operativo`);
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
