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
var ActivosService_1;
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activo, EstadoActivo } from './entities/activo.entity.js';
import { Intervencion } from './entities/intervencion.entity.js';
let ActivosService = ActivosService_1 = class ActivosService {
    activoRepo;
    intervencionRepo;
    logger = new Logger(ActivosService_1.name);
    constructor(activoRepo, intervencionRepo) {
        this.activoRepo = activoRepo;
        this.intervencionRepo = intervencionRepo;
    }
    async findAll() {
        return this.activoRepo.find({ order: { fechaRegistro: 'DESC' } });
    }
    async findOne(id) {
        let activo;
        if (id.length < 36) {
            activo = await this.activoRepo.createQueryBuilder('activo')
                .leftJoinAndSelect('activo.intervenciones', 'intervenciones')
                .where('activo.id LIKE :id', { id: `${id}%` })
                .orWhere('activo.codigo = :codigo', { codigo: id })
                .getOne();
        }
        else {
            activo = await this.activoRepo.findOne({
                where: { id },
                relations: { intervenciones: true }
            });
        }
        if (!activo)
            throw new NotFoundException(`Activo ${id} no encontrado`);
        return activo;
    }
    async create(dto) {
        const estadoInicial = dto.estado || EstadoActivo.DISPONIBLE;
        const activo = this.activoRepo.create({
            ...dto,
            estado: estadoInicial,
        });
        const saved = await this.activoRepo.save(activo);
        const detalleAlta = dto.codigoFactura
            ? `Alta e ingreso a Almacén Central TI · Factura: ${dto.codigoFactura.trim().toUpperCase()}`
            : 'Alta e ingreso a Almacén Central TI (Sin asignar)';
        await this.addIntervencion(saved.id, detalleAlta);
        this.logger.log(`📦 Activo "${saved.codigo}" registrado exitosamente (${saved.estado})`);
        return saved;
    }
    async update(id, dto) {
        const activo = await this.findOne(id);
        const estadoAnterior = activo.estado;
        const sedeAnterior = activo.sede;
        const deptoAnterior = activo.departamento;
        const responsableAnterior = activo.responsable;
        for (const [key, val] of Object.entries(dto)) {
            if (val !== undefined) {
                activo[key] = val;
            }
        }
        const saved = await this.activoRepo.save(activo);
        const huboCambioUbicacion = (dto.sede !== undefined && dto.sede !== sedeAnterior) ||
            (dto.departamento !== undefined && dto.departamento !== deptoAnterior) ||
            (dto.responsable !== undefined && dto.responsable !== responsableAnterior);
        if (huboCambioUbicacion) {
            const destino = `${saved.sede || 'Sede General'}${saved.departamento ? ` · ${saved.departamento}` : ''}${saved.ubicacion ? ` (${saved.ubicacion})` : ''}`;
            const resp = saved.responsable ? ` · Responsable: ${saved.responsable}` : '';
            await this.addIntervencion(saved.id, `📍 Asignación / Traslado operativo a ${destino}${resp}`, dto.tecnicoId);
        }
        if (dto.estado && dto.estado !== estadoAnterior) {
            let detalleEstado = `Cambio de estado: [${estadoAnterior}] ➔ [${dto.estado}]`;
            if (dto.estado === EstadoActivo.REPARACION) {
                detalleEstado = `🛠️ Ingreso a Taller por desperfecto/falla: ${dto.observaciones || 'Revisión técnica general'}`;
            }
            else if (dto.estado === EstadoActivo.OPERATIVO && estadoAnterior === EstadoActivo.REPARACION) {
                detalleEstado = `✅ Reparación concluida en Taller: ${dto.observaciones || 'Equipo operativo y devuelto a servicio'}`;
            }
            else if (dto.estado === EstadoActivo.BAJA) {
                detalleEstado = `🛑 Declarado de Baja / Chatarra: ${dto.observaciones || 'Baja patrimonial definitiva'}`;
            }
            else if (dto.estado === EstadoActivo.DISPONIBLE) {
                detalleEstado = `📦 Retornado a Almacén Central TI: ${dto.observaciones || 'Disponible para nueva asignación'}`;
            }
            else if (dto.observaciones) {
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
    async remove(id) {
        const activo = await this.findOne(id);
        await this.activoRepo.remove(activo);
    }
    async addIntervencion(id, descripcion, tecnicoId) {
        const activo = await this.findOne(id);
        const intervencion = this.intervencionRepo.create({
            descripcion,
            tecnicoId,
            activo
        });
        return this.intervencionRepo.save(intervencion);
    }
};
ActivosService = ActivosService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Activo)),
    __param(1, InjectRepository(Intervencion)),
    __metadata("design:paramtypes", [Repository,
        Repository])
], ActivosService);
export { ActivosService };
//# sourceMappingURL=activos.service.js.map