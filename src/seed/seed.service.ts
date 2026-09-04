import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from '../usuarios/entities/usuario.entity.js';
import { Medalla } from '../gamificacion/entities/medalla.entity.js';
import { Ticket, PrioridadTicket, EstadoTicket, XP_POR_PRIORIDAD } from '../tickets/entities/ticket.entity.js';
import { DispositivoRed, TipoDispositivo, EstadoDispositivo } from '../red/entities/dispositivo-red.entity.js';
import { DireccionIP, EstadoIP } from '../red/entities/direccion-ip.entity.js';
import { Guia } from '../guias/entities/guia.entity.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Medalla) private readonly medallaRepo: Repository<Medalla>,
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(DispositivoRed) private readonly dispositivoRepo: Repository<DispositivoRed>,
    @InjectRepository(DireccionIP) private readonly ipRepo: Repository<DireccionIP>,
    @InjectRepository(Guia) private readonly guiaRepo: Repository<Guia>,
  ) {}

  async onModuleInit() {
    const count = await this.usuarioRepo.count();
    if (count > 0) {
      this.logger.log('✅ BD ya tiene datos, omitiendo semilla');
      return;
    }
    this.logger.log('🌱 Ejecutando semilla de datos...');
    await this.seed();
    this.logger.log('🌱 ¡Semilla completada!');
  }

  private async seed() {
    // ── Usuarios ──────────────────────────────────────────────
    const hash = await bcrypt.hash('admin123', 10);

    const juan = await this.usuarioRepo.save(this.usuarioRepo.create({
      nombre: 'Juan Dev', email: 'juan@clinica.com', password: hash,
      rol: RolUsuario.ADMIN, nivel: 15, xpActual: 4500, avatar: 'JD',
    }));
    const carlos = await this.usuarioRepo.save(this.usuarioRepo.create({
      nombre: 'Carlos Mendoza', email: 'carlos@clinica.com', password: hash,
      rol: RolUsuario.TECNICO, nivel: 18, xpActual: 7200, avatar: 'CM',
    }));
    const ana = await this.usuarioRepo.save(this.usuarioRepo.create({
      nombre: 'Ana Gómez', email: 'ana@clinica.com', password: hash,
      rol: RolUsuario.TECNICO, nivel: 14, xpActual: 3800, avatar: 'AG',
    }));

    // ── Medallas ──────────────────────────────────────────────
    await this.medallaRepo.save([
      { nombre: 'Primer Ticket', descripcion: 'Resuelve tu primer ticket', icono: '🎫', condicionXP: 50 },
      { nombre: 'Resolutor Nato', descripcion: 'Acumula 1000 XP', icono: '🏆', condicionXP: 1000 },
      { nombre: 'Racha de Fuego', descripcion: 'Acumula 5000 XP', icono: '🔥', condicionXP: 5000 },
      { nombre: 'Experto en Redes', descripcion: 'Acumula 10000 XP', icono: '🌐', condicionXP: 10000 },
      { nombre: 'Leyenda TI', descripcion: 'Acumula 50000 XP', icono: '⭐', condicionXP: 50000 },
    ]);

    // ── Tickets ──────────────────────────────────────────────
    await this.ticketRepo.save([
      { titulo: 'Impresora térmica no conecta', descripcion: 'La impresora de farmacia no responde', prioridad: PrioridadTicket.MEDIA, estado: EstadoTicket.ABIERTO, xpRecompensa: XP_POR_PRIORIDAD[PrioridadTicket.MEDIA], asignadoAId: juan.id, solicitante: 'Dra. Martinez' },
      { titulo: 'Caída de red en Piso 3', descripcion: 'Se perdió conectividad en todo el tercer piso', prioridad: PrioridadTicket.ALTA, estado: EstadoTicket.EN_PROGRESO, xpRecompensa: XP_POR_PRIORIDAD[PrioridadTicket.ALTA], asignadoAId: carlos.id, solicitante: 'Enfermería' },
      { titulo: 'Solicitud de nuevo monitor', descripcion: 'Requieren monitor para consultorio 5', prioridad: PrioridadTicket.BAJA, estado: EstadoTicket.ABIERTO, xpRecompensa: XP_POR_PRIORIDAD[PrioridadTicket.BAJA], solicitante: 'Dr. López' },
      { titulo: 'Error en sistema HIS', descripcion: 'El sistema de historia clínica muestra error 500', prioridad: PrioridadTicket.CRITICA, estado: EstadoTicket.RESUELTO, xpRecompensa: XP_POR_PRIORIDAD[PrioridadTicket.CRITICA], asignadoAId: carlos.id, solicitante: 'Admisión', resueltoEn: new Date() },
    ]);

    // ── Dispositivos de Red ─────────────────────────────────
    const sw1 = await this.dispositivoRepo.save({ nombre: 'Core Switch MDF', tipo: TipoDispositivo.SWITCH, estado: EstadoDispositivo.ONLINE, ubicacion: 'Sala de Servidores - Sótano', ipAdministracion: '10.0.0.1', ultimoPing: new Date() });
    const rt1 = await this.dispositivoRepo.save({ nombre: 'Router Borde Principal', tipo: TipoDispositivo.ROUTER, estado: EstadoDispositivo.ONLINE, ubicacion: 'Sala de Servidores - Sótano', ipAdministracion: '10.0.0.2', ultimoPing: new Date() });
    await this.dispositivoRepo.save({ nombre: 'AP Recepción Planta 1', tipo: TipoDispositivo.ACCESS_POINT, estado: EstadoDispositivo.OFFLINE, ubicacion: 'Techo - Planta 1', ipAdministracion: '10.0.10.15' });
    await this.dispositivoRepo.save({ nombre: 'Switch Quirófano', tipo: TipoDispositivo.SWITCH, estado: EstadoDispositivo.WARNING, ubicacion: 'Piso 2 - IDF', ipAdministracion: '10.0.2.1', ultimoPing: new Date() });

    // ── Direcciones IP ──────────────────────────────────────
    await this.ipRepo.save([
      { ip: '10.0.20.101', vlan: 'VLAN 20 - Admisión', estado: EstadoIP.OCUPADA, dispositivoId: sw1.id },
      { ip: '10.0.20.102', vlan: 'VLAN 20 - Admisión', estado: EstadoIP.OCUPADA, dispositivoId: sw1.id },
      { ip: '10.0.20.103', vlan: 'VLAN 20 - Admisión', estado: EstadoIP.LIBRE },
      { ip: '10.0.30.50', vlan: 'VLAN 30 - Médica', estado: EstadoIP.OCUPADA, dispositivoId: rt1.id },
      { ip: '10.0.30.51', vlan: 'VLAN 30 - Médica', estado: EstadoIP.LIBRE },
    ]);

    // ── Guías ────────────────────────────────────────────────
    await this.guiaRepo.save([
      { titulo: 'Manual de Configuración de Impresora Térmica', urlPdf: '/docs/impresora-termica.pdf', peso: '2.4 MB', autorId: carlos.id },
      { titulo: 'Protocolo de Caída de Servidor HIS', urlPdf: '/docs/caida-servidor.pdf', peso: '1.1 MB', autorId: juan.id },
      { titulo: 'Guía de Creación de Usuarios VPN', urlPdf: '/docs/vpn-users.pdf', peso: '850 KB', autorId: ana.id },
      { titulo: 'Checklist de Mantenimiento Preventivo', urlPdf: '/docs/mantenimiento.pdf', peso: '3.2 MB', autorId: carlos.id },
    ]);
  }
}
