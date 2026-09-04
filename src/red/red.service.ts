import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DispositivoRed } from './entities/dispositivo-red.entity.js';
import { DireccionIP, EstadoIP } from './entities/direccion-ip.entity.js';

@Injectable()
export class RedService {
  constructor(
    @InjectRepository(DispositivoRed) private readonly dispositivoRepo: Repository<DispositivoRed>,
    @InjectRepository(DireccionIP) private readonly ipRepo: Repository<DireccionIP>,
  ) {}

  // ── Dispositivos ──────────────────────────────────────────────────────────
  async findAllDispositivos() { return this.dispositivoRepo.find({ order: { nombre: 'ASC' } }); }
  async findDispositivo(id: string) {
    const d = await this.dispositivoRepo.findOne({ where: { id }, relations: { direccionesIP: true } });
    if (!d) throw new NotFoundException(`Dispositivo ${id} no encontrado`);
    return d;
  }
  async createDispositivo(data: Partial<DispositivoRed>) { return this.dispositivoRepo.save(this.dispositivoRepo.create(data)); }
  async updateDispositivo(id: string, data: Partial<DispositivoRed>) {
    const d = await this.findDispositivo(id);
    Object.assign(d, data);
    return this.dispositivoRepo.save(d);
  }

  // ── Direcciones IP ────────────────────────────────────────────────────────
  async findAllIPs() { return this.ipRepo.find({ relations: { dispositivo: true }, order: { ip: 'ASC' } }); }
  async asignarIP(ip: string, dispositivoId: string) {
    const direccion = await this.ipRepo.findOneBy({ ip });
    if (!direccion) throw new NotFoundException(`IP ${ip} no registrada`);
    direccion.dispositivoId = dispositivoId;
    direccion.estado = EstadoIP.OCUPADA;
    return this.ipRepo.save(direccion);
  }
  async liberarIP(ip: string) {
    const direccion = await this.ipRepo.findOneBy({ ip });
    if (!direccion) throw new NotFoundException(`IP ${ip} no registrada`);
    direccion.dispositivoId = null as any;
    direccion.estado = EstadoIP.LIBRE;
    return this.ipRepo.save(direccion);
  }
}
