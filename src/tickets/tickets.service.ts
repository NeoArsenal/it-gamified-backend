import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, EstadoTicket, PrioridadTicket } from './entities/ticket.entity.js';
import { TicketHistorial, TipoAccionHistorial } from './entities/ticket-historial.entity.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { NotificacionesGateway } from '../notificaciones/notificaciones.gateway.js';
import { PushNotificationService } from '../notificaciones/push-notification.service.js';
import { StorageService } from '../storage/storage.service.js';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(TicketHistorial) private readonly historialRepo: Repository<TicketHistorial>,
    private readonly notificacionesGateway: NotificacionesGateway,
    private readonly pushNotificationService: PushNotificationService,
    private readonly storageService: StorageService,
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
        fotoUrl: true,
      },
      order: { creadoEn: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOneBy({ id });
    if (!ticket) throw new NotFoundException(`Ticket ${id} no encontrado`);
    return ticket;
  }

  // Consulta de tickets activos públicos (ABIERTO, EN_PROGRESO y RESUELTO recientemente) para el portal
  async getActivePublicTickets() {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const qb = this.ticketRepo.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.asignadoA', 'asignadoA')
      .where(
        '(ticket.estado IN (:...estados)) OR (ticket.estado = :resuelto AND (ticket.resueltoEn >= :since OR ticket.actualizadoEn >= :since))',
        {
          estados: [EstadoTicket.ABIERTO, EstadoTicket.EN_PROGRESO],
          resuelto: EstadoTicket.RESUELTO,
          since: fifteenMinutesAgo,
        },
      )
      .orderBy('ticket.creadoEn', 'DESC')
      .take(50);

    const tickets = await qb.getMany();

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
      fotoUrl: t.fotoUrl,
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
        fotoUrl: t.fotoUrl,
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
    const ticket = this.ticketRepo.create({
      ...dto,
      prioridad,
    });
    const saved = await this.ticketRepo.save(ticket);

    // Registro inicial en la Línea de Tiempo / Auditoría
    try {
      await this.historialRepo.save(
        this.historialRepo.create({
          ticketId: saved.id,
          usuarioNombre: dto.solicitanteNombre || 'Portal de Auto-servicio',
          tipoAccion: TipoAccionHistorial.CREADO,
          descripcion: `Ticket creado con urgencia ${saved.prioridad}${saved.departamento ? ` para el área de ${saved.departamento}` : ''}${saved.sede ? ` en ${saved.sede}` : ''}.`,
          detalles: JSON.stringify({ prioridad: saved.prioridad, sede: saved.sede, departamento: saved.departamento }),
        })
      );
    } catch (err: any) {
      this.logger.warn(`Error registrando auditoría inicial para ticket ${saved.id}: ${err?.message}`);
    }

    this.notificacionesGateway.emitirNuevoTicket(saved);
    this.pushNotificationService.sendNewTicketAlert(saved).catch((err) => {
      this.logger.error('Error enviando notificación Push para nuevo ticket:', err?.message || err);
    });
    this.logger.log(`🎫 Ticket "${saved.titulo}" creado (${saved.prioridad})`);
    return saved;
  }

  async update(id: string, dto: UpdateTicketDto, usuario?: any): Promise<Ticket> {
    const ticket = await this.findOne(id);
    const estadoAnterior = ticket.estado;
    const prioridadAnterior = ticket.prioridad;
    const solucionAnterior = ticket.solucion;
    const asignadoAnteriorId = ticket.asignadoAId;

    const usuarioNombre = usuario?.nombre || 'Técnico TI';
    const usuarioId = usuario?.id || undefined;

    const auditorias: any[] = [];

    // Solo asignar campos definidos para evitar sobreescribir con undefined
    for (const [key, val] of Object.entries(dto)) {
      if (val !== undefined) {
        (ticket as any)[key] = val;
      }
    }

    // Si el ticket pasó a RESUELTO, registrar fecha de resolución técnica
    if (dto.estado === EstadoTicket.RESUELTO && estadoAnterior !== EstadoTicket.RESUELTO) {
      ticket.resueltoEn = new Date();
    }

    // Detectar cambios relevantes para la línea de tiempo de auditoría
    if (dto.estado && dto.estado !== estadoAnterior) {
      auditorias.push({
        ticketId: ticket.id,
        usuarioId,
        usuarioNombre,
        tipoAccion: dto.estado === EstadoTicket.CERRADO ? TipoAccionHistorial.CERRADO : TipoAccionHistorial.CAMBIO_ESTADO,
        descripcion: `Estado actualizado de ${estadoAnterior.replace('_', ' ')} a ${dto.estado.replace('_', ' ')} por ${usuarioNombre}.`,
        detalles: JSON.stringify({ anterior: estadoAnterior, nuevo: dto.estado }),
      });
    }

    if (dto.prioridad && dto.prioridad !== prioridadAnterior) {
      auditorias.push({
        ticketId: ticket.id,
        usuarioId,
        usuarioNombre,
        tipoAccion: TipoAccionHistorial.CAMBIO_PRIORIDAD,
        descripcion: `Nivel de urgencia reclasificado de ${prioridadAnterior} a ${dto.prioridad} por ${usuarioNombre}.`,
        detalles: JSON.stringify({ anterior: prioridadAnterior, nuevo: dto.prioridad }),
      });
    }

    if (dto.asignadoAId && dto.asignadoAId !== asignadoAnteriorId) {
      auditorias.push({
        ticketId: ticket.id,
        usuarioId,
        usuarioNombre,
        tipoAccion: TipoAccionHistorial.ASIGNADO,
        descripcion: `Ticket asignado a técnico por ${usuarioNombre}.`,
        detalles: JSON.stringify({ asignadoAId: dto.asignadoAId }),
      });
    }

    if (dto.solucion && dto.solucion !== solucionAnterior) {
      auditorias.push({
        ticketId: ticket.id,
        usuarioId,
        usuarioNombre,
        tipoAccion: TipoAccionHistorial.SOLUCION_REGISTRADA,
        descripcion: `Solución técnica documentada por ${usuarioNombre}: "${dto.solucion.substring(0, 70)}${dto.solucion.length > 70 ? '...' : ''}"`,
        detalles: JSON.stringify({ solucion: dto.solucion }),
      });
    }

    await this.ticketRepo.save(ticket);

    // Guardar registros de auditoría
    for (const item of auditorias) {
      try {
        await this.historialRepo.save(this.historialRepo.create(item));
      } catch (err: any) {
        this.logger.warn(`Error guardando auditoría de ticket: ${err?.message}`);
      }
    }

    const updated = await this.findOne(id);
    this.notificacionesGateway.emitirTicketActualizado(updated, {
      actualizadoPor: usuario ? { id: usuario.id, nombre: usuario.nombre } : undefined,
    });
    return updated;
  }

  async getHistorial(ticketId: string): Promise<TicketHistorial[]> {
    return this.historialRepo.find({
      where: { ticketId },
      order: { creadoEn: 'DESC' },
      relations: { usuario: true },
    });
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id);
    if (ticket.fotoUrl) {
      try {
        await this.storageService.deleteFile(ticket.fotoUrl);
      } catch (e: any) {
        this.logger.warn(`No se pudo eliminar la imagen de Storage para ticket ${id}: ${e?.message}`);
      }
    }
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
