import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DispositivoRed, EstadoDispositivo } from './entities/dispositivo-red.entity.js';
import { DireccionIP, EstadoIP } from './entities/direccion-ip.entity.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
import { AccionXP } from '../gamificacion/entities/historial-xp.entity.js';

@Injectable()
export class RedService implements OnModuleInit {
  constructor(
    @InjectRepository(DispositivoRed) private readonly dispositivoRepo: Repository<DispositivoRed>,
    @InjectRepository(DireccionIP) private readonly ipRepo: Repository<DireccionIP>,
    private readonly gamificacionService: GamificacionService,
  ) {}

  async onModuleInit() {
    // Migración/Seed: Asignar sede y área a IPs existentes que no tengan
    const ips = await this.ipRepo.find();
    let changed = false;
    for (const ip of ips) {
      if (!ip.sede) {
        if (ip.ip.startsWith('10.0.20')) {
          ip.sede = 'Sede San Isidro';
          ip.area = 'Administración';
        } else if (ip.ip.startsWith('10.0.30')) {
          ip.sede = 'Sede San Isidro';
          ip.area = 'Urgencias';
        } else {
          ip.sede = 'Sede Tower';
          ip.area = 'Farmacia';
        }
        await this.ipRepo.save(ip);
        changed = true;
      }
    }
    
    // Si hay muy pocas IPs, generar más para que el mapa se vea bien
    if (ips.length < 10) {
      const nuevasIPs = [
        { ip: '10.0.20.104', vlan: 'VLAN 20', estado: EstadoIP.LIBRE, sede: 'Sede San Isidro', area: 'Administración' },
        { ip: '10.0.20.105', vlan: 'VLAN 20', estado: EstadoIP.LIBRE, sede: 'Sede San Isidro', area: 'Administración' },
        { ip: '10.0.30.52', vlan: 'VLAN 30', estado: EstadoIP.LIBRE, sede: 'Sede San Isidro', area: 'Urgencias' },
        { ip: '10.0.30.53', vlan: 'VLAN 30', estado: EstadoIP.LIBRE, sede: 'Sede San Isidro', area: 'Urgencias' },
        { ip: '10.1.10.10', vlan: 'VLAN 10', estado: EstadoIP.OCUPADA, sede: 'Sede Tower', area: 'UCI' },
        { ip: '10.1.10.11', vlan: 'VLAN 10', estado: EstadoIP.LIBRE, sede: 'Sede Tower', area: 'UCI' },
        { ip: '10.1.20.5', vlan: 'VLAN 20', estado: EstadoIP.OCUPADA, sede: 'Sede Tower', area: 'Farmacia' },
        { ip: '10.1.20.6', vlan: 'VLAN 20', estado: EstadoIP.LIBRE, sede: 'Sede Tower', area: 'Farmacia' },
      ];
      for (const n of nuevasIPs) {
        if (!ips.find(i => i.ip === n.ip)) {
          await this.ipRepo.save(this.ipRepo.create(n));
        }
      }
    }
  }

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

  async simularCaida() {
    // Buscar dispositivos ONLINE
    const dispositivos = await this.dispositivoRepo.find({ where: { estado: EstadoDispositivo.ONLINE } });
    if (dispositivos.length === 0) return { message: 'Todos los dispositivos están offline' };
    
    // Escoger uno al azar
    const randomIdx = Math.floor(Math.random() * dispositivos.length);
    const victima = dispositivos[randomIdx];
    
    // Cambiar estado a OFFLINE o WARNING
    victima.estado = Math.random() > 0.5 ? EstadoDispositivo.OFFLINE : EstadoDispositivo.WARNING;
    await this.dispositivoRepo.save(victima);
    return victima;
  }

  async restaurarDispositivo(id: string, tecnicoId: string) {
    const d = await this.findDispositivo(id);
    if (d.estado === EstadoDispositivo.ONLINE) return d; // Ya está online

    d.estado = EstadoDispositivo.ONLINE;
    d.ultimoPing = new Date();
    await this.dispositivoRepo.save(d);

    // Otorgar puntos al técnico que lo restauró! (250 XP)
    if (tecnicoId) {
      await this.gamificacionService.otorgarXP(
        tecnicoId,
        250,
        AccionXP.EQUIPO_RESTAURADO,
        `Restauró el dispositivo ${d.nombre} (${d.tipo})`
      );
    }

    return d;
  }

  // 🔥 Direcciones IP 🔥
  async findAllIPs() { return this.ipRepo.find({ relations: { dispositivo: true }, order: { ip: 'ASC' } }); }
  
  async registrarIP(data: Partial<DireccionIP>) {
    const existe = await this.ipRepo.findOneBy({ ip: data.ip });
    if (existe) throw new Error(`La IP ${data.ip} ya existe`);
    return this.ipRepo.save(this.ipRepo.create({ ...data, estado: EstadoIP.LIBRE }));
  }

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
