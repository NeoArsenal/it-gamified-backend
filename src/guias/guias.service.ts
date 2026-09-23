import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guia } from './entities/guia.entity.js';

@Injectable()
export class GuiasService {
  constructor(
    @InjectRepository(Guia) private readonly guiaRepo: Repository<Guia>,
  ) {}

  async findAll() { return this.guiaRepo.find({ order: { fechaSubida: 'DESC' } }); }

  async search(query: string) {
    if (!query) return this.findAll();
    return this.guiaRepo.createQueryBuilder('guia')
      .leftJoinAndSelect('guia.autor', 'autor')
      .where('LOWER(guia.titulo) LIKE LOWER(:q)', { q: `%${query}%` })
      .orWhere('LOWER(guia.contenidoRichText) LIKE LOWER(:q)', { q: `%${query}%` })
      .orderBy('guia.fechaSubida', 'DESC')
      .getMany();
  }

  async findOne(id: string) {
    const g = await this.guiaRepo.findOneBy({ id });
    if (!g) throw new NotFoundException(`Guía ${id} no encontrada`);
    return g;
  }

  async create(data: Partial<Guia>) {
    return this.guiaRepo.save(this.guiaRepo.create(data));
  }

  async remove(id: string) {
    const g = await this.findOne(id);
    await this.guiaRepo.remove(g);
  }
}
