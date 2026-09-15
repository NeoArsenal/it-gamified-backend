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
    const ticket = this.ticketRepo.create({
      ...dto,
      prioridad,
      xpRecompensa: XP_POR_PRIORIDAD[prioridad],
    });
    const saved = await this.ticketRepo.save(ticket);
    this.notificacionesGateway.emitirNuevoTicket(saved);
    this.logger.log(`🎫 Ticket "${saved.titulo}" creado (${saved.prioridad}) → +${saved.xpRecompensa} XP al resolverlo`);
    return saved;
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
      ticket.xpRecompensa = XP_POR_PRIORIDAD[dto.prioridad];
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
