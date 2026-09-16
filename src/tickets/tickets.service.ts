import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, EstadoTicket, PrioridadTicket, XP_POR_PRIORIDAD } from './entities/ticket.entity.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
import { AccionXP } from '../gamificacion/entities/historial-xp.entity.js';
import { NotificacionesGateway } from '../notificaciones/notificaciones.gateway.js';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    private readonly gamificacionService: GamificacionService,
    private readonly notificacionesGateway: NotificacionesGateway,
  ) {}

  async findAll(): Promise<Ticket[]> {
    return this.ticketRepo.find({ order: { creadoEn: 'DESC' } });
  }

  // Ruta pública segura: solo expone campos no sensibles (oculta teléfonos, nombres privados y soluciones)
  async findAllPublic(): Promise<Partial<Ticket>[]> {
    return this.ticketRepo.find({
      select: {
        id: true,
        titulo: true,
        estado: true,
        prioridad: true,
        sede: true,
        departamento: true,
        ubicacionEspecifica: true,
        creadoEn: true,
        xpRecompensa: true,
      },
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOneBy({ id });
    if (!ticket) throw new NotFoundException(`Ticket ${id} no encontrado`);
    return ticket;
  }

  // Consulta de tickets activos públicos (ABIERTO y EN_PROGRESO) para el acumulado del portal
  async getActivePublicTickets() {
    const tickets = await this.ticketRepo.find({
      where: [
        { estado: EstadoTicket.ABIERTO },
        { estado: EstadoTicket.EN_PROGRESO },
      ],
      relations: { asignadoA: true },
      order: { creadoEn: 'DESC' },
      take: 50,
    });

    return tickets.map(t => ({
      id: t.id,
      ticketCode: `TK-${t.id.slice(0, 6).toUpperCase()}`,
      titulo: t.titulo,
      descripcion: t.descripcion,
      estado: t.estado,
      prioridad: t.prioridad,
      sede: t.sede,
      departamento: t.departamento,
      ubicacionEspecifica: t.ubicacionEspecifica,
      solicitanteNombre: t.solicitanteNombre,
      creadoEn: t.creadoEn,
      actualizadoEn: t.actualizadoEn,
      tecnicoAsignado: t.asignadoA ? {
        nombre: t.asignadoA.nombre,
        avatar: t.asignadoA.avatar,
        rol: t.asignadoA.rol,
      } : null,
    }));
  }

  // Consulta pública sanitizada de seguimiento para personal asistencial
  async trackTicket(query: string) {
    const raw = (query || '').trim();
    if (!raw || raw.length < 3) {
      throw new NotFoundException('Ingresa al menos 3 caracteres del código o teléfono');
    }

    const cleanCode = raw.replace(/^[#\s]*(TK-?)?/i, '').replace(/\s+/g, '').toLowerCase();
    const digitsOnly = raw.replace(/\D/g, '');

    try {
      const qb = this.ticketRepo.createQueryBuilder('ticket')
        .leftJoinAndSelect('ticket.asignadoA', 'asignadoA')
        .orderBy('ticket.creadoEn', 'DESC')
        .take(15);

      // Usar CAST(ticket.id AS text) para evitar error PostgreSQL 'lower(uuid) does not exist'
      if (digitsOnly.length >= 3 && cleanCode.length >= 3) {
        qb.where('(CAST(ticket.id AS text) LIKE :codeLike OR ticket.solicitanteContacto LIKE :phoneLike)', {
          codeLike: `%${cleanCode}%`,
          phoneLike: `%${digitsOnly}%`,
        });
      } else if (digitsOnly.length >= 3) {
        qb.where('ticket.solicitanteContacto LIKE :phoneLike', {
          phoneLike: `%${digitsOnly}%`,
        });
      } else {
        qb.where('CAST(ticket.id AS text) LIKE :codeLike', {
          codeLike: `%${cleanCode}%`,
        });
      }

      const tickets = await qb.getMany();
      if (!tickets || tickets.length === 0) {
        throw new NotFoundException(`No se encontró ningún ticket con "${raw}"`);
      }

      return tickets.map(t => ({
        id: t.id,
        ticketCode: `TK-${t.id.slice(0, 6).toUpperCase()}`,
        titulo: t.titulo,
        descripcion: t.descripcion,
        estado: t.estado,
        prioridad: t.prioridad,
        sede: t.sede,
        departamento: t.departamento,
        ubicacionEspecifica: t.ubicacionEspecifica,
        solicitanteNombre: t.solicitanteNombre,
        creadoEn: t.creadoEn,
        actualizadoEn: t.actualizadoEn,
        resueltoEn: t.resueltoEn,
        solucion: t.solucion,
        tecnicoAsignado: t.asignadoA ? {
          nombre: t.asignadoA.nombre,
          avatar: t.asignadoA.avatar,
          rol: t.asignadoA.rol,
        } : null,
      }));
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      this.logger.error(`Error buscando ticket con "${raw}": ${err.message}`, err.stack);
      throw new NotFoundException(`No se encontró ningún ticket con "${raw}"`);
    }
  }

  async create(dto: CreateTicketDto): Promise<Ticket> {
    // 🛡️ Protección Honeypot: si el campo trampa fue rellenado por un bot, se descarta silenciosamente
    if (dto.website && dto.website.trim().length > 0) {
      this.logger.warn(`🤖 [Honeypot] Bot detectado intentando spamear ticket: "${dto.titulo}"`);
      return {
        id: 'bot-discarded',
        titulo: dto.titulo,
        estado: EstadoTicket.ABIERTO,
        prioridad: PrioridadTicket.BAJA,
        xpRecompensa: 0,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      } as Ticket;
    }

    const prioridad = dto.prioridad || PrioridadTicket.MEDIA;
    const xpRecompensa = await this.getXpPorPrioridad(prioridad);
    const ticket = this.ticketRepo.create({
      ...dto,
      prioridad,
      xpRecompensa,
    });
    const saved = await this.ticketRepo.save(ticket);
    this.notificacionesGateway.emitirNuevoTicket(saved);
    this.logger.log(`🎫 Ticket "${saved.titulo}" creado (${saved.prioridad}) → +${saved.xpRecompensa} XP al resolverlo`);
    return saved;
  }

  private async getXpPorPrioridad(prioridad: PrioridadTicket): Promise<number> {
    try {
      const reglas = await this.gamificacionService.getReglas();
      if (prioridad === PrioridadTicket.CRITICA) return reglas.puntosPorArea.ticketCritica;
      if (prioridad === PrioridadTicket.ALTA) return reglas.puntosPorArea.ticketAlta;
      if (prioridad === PrioridadTicket.MEDIA) return reglas.puntosPorArea.ticketMedia;
      return reglas.puntosPorArea.ticketBaja;
    } catch {
      return XP_POR_PRIORIDAD[prioridad] || 150;
    }
  }

  async update(id: string, dto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);
    const estadoAnterior = ticket.estado;

    // Solo asignar campos definidos para evitar sobreescribir con undefined
    for (const [key, val] of Object.entries(dto)) {
      if (val !== undefined) {
        (ticket as any)[key] = val;
      }
    }

    // Recalcular XP si la prioridad cambió
    if (dto.prioridad) {
      ticket.xpRecompensa = await this.getXpPorPrioridad(dto.prioridad);
    }

    // Si el ticket pasó a RESUELTO, otorgar XP al técnico asignado
    if (dto.estado === EstadoTicket.RESUELTO && estadoAnterior !== EstadoTicket.RESUELTO) {
      ticket.resueltoEn = new Date();

      if (ticket.asignadoAId) {
        const resultado = await this.gamificacionService.otorgarXP(
          ticket.asignadoAId,
          ticket.xpRecompensa,
          AccionXP.TICKET_RESUELTO,
          `Resolvió ticket "${ticket.titulo}" (${ticket.prioridad})`,
        );
        this.logger.log(`⚡ +${resultado.xpOtorgado} XP → Técnico ahora tiene ${resultado.nuevoXP} XP (Nivel ${resultado.nivel})`);
      }
    }

    await this.ticketRepo.save(ticket);
    const updated = await this.findOne(id);
    this.notificacionesGateway.emitirTicketActualizado(updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id);
    await this.ticketRepo.remove(ticket);
    this.notificacionesGateway.emitirTicketEliminado(id);
    this.logger.log(`🗑️ Ticket "${ticket.titulo}" eliminado`);
  }

  /** Estadísticas rápidas para el dashboard */
  async getEstadisticas() {
    const total = await this.ticketRepo.count();
    const abiertos = await this.ticketRepo.count({ where: { estado: EstadoTicket.ABIERTO } });
    const enProgreso = await this.ticketRepo.count({ where: { estado: EstadoTicket.EN_PROGRESO } });
    const resueltos = await this.ticketRepo.count({ where: { estado: EstadoTicket.RESUELTO } });
    return { total, abiertos, enProgreso, resueltos };
  }

  /** Analítica Avanzada */
  async getAnalytics(sedeFiltro?: string) {
    const allTickets = await this.ticketRepo.find();

    // 1. Sedes disponibles únicas detectadas en tickets
    const sedesSet = new Set<string>();
    for (const t of allTickets) {
      if (t.sede && t.sede.trim()) {
        sedesSet.add(t.sede.trim());
      }
    }
    if (sedesSet.size === 0) {
      sedesSet.add('Clínica');
      sedesSet.add('Tower 1');
    }
    const sedesDisponibles = Array.from(sedesSet);

    // 2. Benchmark comparativo inter-sedes (para vista global consolidada)
    const porSedeMap: Record<string, { total: number; resueltos: number; sumaSLADias: number; resueltosConFechas: number; criticos: number; abiertos: number }> = {};
    for (const t of allTickets) {
      const s = (t.sede && t.sede.trim()) ? t.sede.trim() : 'Sin Asignar';
      if (!porSedeMap[s]) {
        porSedeMap[s] = { total: 0, resueltos: 0, sumaSLADias: 0, resueltosConFechas: 0, criticos: 0, abiertos: 0 };
      }
      porSedeMap[s].total++;
      if (t.estado === EstadoTicket.RESUELTO || t.estado === EstadoTicket.CERRADO) {
        porSedeMap[s].resueltos++;
      } else {
        porSedeMap[s].abiertos++;
      }
      if (t.prioridad === PrioridadTicket.CRITICA || t.prioridad === PrioridadTicket.ALTA) {
        porSedeMap[s].criticos++;
      }
      if (t.resueltoEn && t.creadoEn) {
        const ms = new Date(t.resueltoEn).getTime() - new Date(t.creadoEn).getTime();
        const dias = ms / (1000 * 60 * 60 * 24);
        porSedeMap[s].sumaSLADias += dias;
        porSedeMap[s].resueltosConFechas++;
      }
    }

    const porSede = Object.keys(porSedeMap).map(s => {
      const item = porSedeMap[s];
      const promSLADias = item.resueltosConFechas > 0 ? (item.sumaSLADias / item.resueltosConFechas) : 0;
      return {
        sede: s,
        total: item.total,
        resueltos: item.resueltos,
        abiertos: item.abiertos,
        criticos: item.criticos,
        promedioSLADias: promSLADias,
        promedioSLAHoras: +(promSLADias * 24).toFixed(1),
        porcentajeResolucion: item.total > 0 ? Math.round((item.resueltos / item.total) * 100) : 0,
      };
    }).sort((a, b) => b.total - a.total);

    // 3. Filtrar tickets según la sede seleccionada (o consolidar todas si es 'TODAS')
    const isFiltrado = Boolean(sedeFiltro && sedeFiltro !== 'TODAS');
    const tickets = isFiltrado
      ? allTickets.filter(t => (t.sede || '').trim().toLowerCase() === sedeFiltro!.trim().toLowerCase())
      : allTickets;

    // 4. Distribución por departamento vs Prioridad (Heatmap adaptativo)
    const deptPrioridadMap: Record<string, Record<PrioridadTicket, number>> = {};
    let sumaSLADias = 0;
    let resueltosConFechas = 0;

    for (const t of tickets) {
      const dept = t.departamento || 'General';
      const prio = t.prioridad || PrioridadTicket.MEDIA;

      if (!deptPrioridadMap[dept]) {
        deptPrioridadMap[dept] = {
          [PrioridadTicket.BAJA]: 0,
          [PrioridadTicket.MEDIA]: 0,
          [PrioridadTicket.ALTA]: 0,
          [PrioridadTicket.CRITICA]: 0,
        };
      }
      deptPrioridadMap[dept][prio]++;

      // SLA (en minutos / horas)
      if (t.resueltoEn && t.creadoEn) {
        const ms = new Date(t.resueltoEn).getTime() - new Date(t.creadoEn).getTime();
        const dias = ms / (1000 * 60 * 60 * 24);
        sumaSLADias += dias;
        resueltosConFechas++;
      }
    }

    const promedioSLADias = resueltosConFechas > 0 ? (sumaSLADias / resueltosConFechas) : 0;
    
    // Transformar a formato de array para gráficos
    const trueHeatmap = Object.keys(deptPrioridadMap).map(dept => ({
      departamento: dept,
      BAJA: deptPrioridadMap[dept][PrioridadTicket.BAJA],
      MEDIA: deptPrioridadMap[dept][PrioridadTicket.MEDIA],
      ALTA: deptPrioridadMap[dept][PrioridadTicket.ALTA],
      CRITICA: deptPrioridadMap[dept][PrioridadTicket.CRITICA],
      total: deptPrioridadMap[dept][PrioridadTicket.BAJA] + deptPrioridadMap[dept][PrioridadTicket.MEDIA] + deptPrioridadMap[dept][PrioridadTicket.ALTA] + deptPrioridadMap[dept][PrioridadTicket.CRITICA]
    })).sort((a, b) => b.total - a.total);

    return {
      heatmapDept: trueHeatmap,
      promedioSLADias,
      totalTickets: tickets.length,
      resueltosCount: tickets.filter(t => t.estado === EstadoTicket.RESUELTO || t.estado === EstadoTicket.CERRADO).length,
      sedesDisponibles,
      porSede,
      sedeActiva: isFiltrado ? sedeFiltro : 'TODAS',
      totalTicketsGlobal: allTickets.length,
    };
  }
}
