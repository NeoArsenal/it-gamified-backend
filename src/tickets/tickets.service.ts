import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, EstadoTicket, PrioridadTicket, XP_POR_PRIORIDAD } from './entities/ticket.entity.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
import { AccionXP } from '../gamificacion/entities/historial-xp.entity.js';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    private readonly gamificacionService: GamificacionService,
  ) {}

  async findAll(): Promise<Ticket[]> {
    return this.ticketRepo.find({ order: { creadoEn: 'DESC' } });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOneBy({ id });
    if (!ticket) throw new NotFoundException(`Ticket ${id} no encontrado`);
    return ticket;
  }

  async create(dto: CreateTicketDto): Promise<Ticket> {
    const prioridad = dto.prioridad || PrioridadTicket.MEDIA;
    const ticket = this.ticketRepo.create({
      ...dto,
      prioridad,
      xpRecompensa: XP_POR_PRIORIDAD[prioridad],
    });
    const saved = await this.ticketRepo.save(ticket);
    this.logger.log(`🎫 Ticket "${saved.titulo}" creado (${saved.prioridad}) → +${saved.xpRecompensa} XP al resolverlo`);
    return saved;
  }

  async update(id: string, dto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);
    const estadoAnterior = ticket.estado;

    Object.assign(ticket, dto);

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

    return this.ticketRepo.save(ticket);
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id);
    await this.ticketRepo.remove(ticket);
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
  async getAnalytics() {
    const tickets = await this.ticketRepo.find();

    // 1. Distribución por departamento vs Prioridad para el verdadero Heatmap
    const deptPrioridadMap: Record<string, Record<PrioridadTicket, number>> = {};
    
    // 2. Tiempos de resolución para SLA
    let sumaSLADias = 0;
    let resueltosConFechas = 0;

    for (const t of tickets) {
      // Dept
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
      if (t.estado === EstadoTicket.RESUELTO && t.resueltoEn && t.creadoEn) {
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
    })).sort((a, b) => b.total - a.total); // Ordenar por más fallas

    return {
      heatmapDept: trueHeatmap,
      promedioSLADias,
      totalTickets: tickets.length,
      resueltosCount: resueltosConFechas
    };
  }
}
