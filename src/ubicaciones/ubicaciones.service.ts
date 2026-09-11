import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ubicacion } from './entities/ubicacion.entity.js';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto.js';

@Injectable()
export class UbicacionesService {
  constructor(
    @InjectRepository(Ubicacion)
    private ubicacionRepo: Repository<Ubicacion>,
  ) {}

  async findAll(): Promise<Ubicacion[]> {
    return this.ubicacionRepo.find({
      relations: { creadoPor: true },
      order: { creadoEn: 'DESC' },
    });
  }

  async findSedes(): Promise<string[]> {
    const ubicaciones = await this.ubicacionRepo
      .createQueryBuilder('ubicacion')
      .select('DISTINCT ubicacion.sede', 'sede')
      .getRawMany();
    return ubicaciones.map(u => u.sede);
  }

  async findDepartamentosPorSede(sede: string): Promise<string[]> {
    const ubicaciones = await this.ubicacionRepo
      .createQueryBuilder('ubicacion')
      .select('DISTINCT ubicacion.departamento', 'departamento')
      .where('ubicacion.sede = :sede', { sede })
      .getRawMany();
    return ubicaciones.map(u => u.departamento);
  }

  async findAreas(sede: string, departamento: string): Promise<string[]> {
    const ubicaciones = await this.ubicacionRepo
      .createQueryBuilder('ubicacion')
      .select('DISTINCT ubicacion.area', 'area')
      .where('ubicacion.sede = :sede', { sede })
      .andWhere('ubicacion.departamento = :departamento', { departamento })
      .getRawMany();
    return ubicaciones.map(u => u.area);
  }

  async create(createUbicacionDto: CreateUbicacionDto, usuarioId?: string): Promise<Ubicacion> {
    const ubicacion = this.ubicacionRepo.create({
      ...createUbicacionDto,
      creadoPorId: usuarioId,
    });
    return this.ubicacionRepo.save(ubicacion);
  }

  async remove(id: string): Promise<void> {
    const result = await this.ubicacionRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ubicacion con ID ${id} no encontrada`);
    }
  }
}
