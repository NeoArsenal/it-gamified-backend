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
var TicketsService_1;
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, EstadoTicket, PrioridadTicket } from './entities/ticket.entity.js';
import { NotificacionesGateway } from '../notificaciones/notificaciones.gateway.js';
let TicketsService = TicketsService_1 = class TicketsService {
    ticketRepo;
    notificacionesGateway;
    logger = new Logger(TicketsService_1.name);
    constructor(ticketRepo, notificacionesGateway) {
        this.ticketRepo = ticketRepo;
        this.notificacionesGateway = notificacionesGateway;
    }
    async findAll() {
        return this.ticketRepo.find({ order: { creadoEn: 'DESC' } });
    }
    async findAllPublic() {
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
    async findOne(id) {
        const ticket = await this.ticketRepo.findOneBy({ id });
        if (!ticket)
            throw new NotFoundException(`Ticket ${id} no encontrado`);
        return ticket;
    }
    async getActivePublicTickets() {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const qb = this.ticketRepo.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.asignadoA', 'asignadoA')
            .where('(ticket.estado IN (:...estados)) OR (ticket.estado = :resuelto AND (ticket.resueltoEn >= :since OR ticket.actualizadoEn >= :since))', {
            estados: [EstadoTicket.ABIERTO, EstadoTicket.EN_PROGRESO],
            resuelto: EstadoTicket.RESUELTO,
            since: fifteenMinutesAgo,
        })
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
            tecnicoAsignado: t.asignadoA ? {
                nombre: t.asignadoA.nombre,
                avatar: t.asignadoA.avatar,
                rol: t.asignadoA.rol,
            } : null,
        }));
    }
    async trackTicket(query) {
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
            if (digitsOnly.length >= 3 && cleanCode.length >= 3) {
                qb.where('(CAST(ticket.id AS text) LIKE :codeLike OR ticket.solicitanteContacto LIKE :phoneLike)', {
                    codeLike: `%${cleanCode}%`,
                    phoneLike: `%${digitsOnly}%`,
                });
            }
            else if (digitsOnly.length >= 3) {
                qb.where('ticket.solicitanteContacto LIKE :phoneLike', {
                    phoneLike: `%${digitsOnly}%`,
                });
            }
            else {
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
        }
        catch (err) {
            if (err instanceof NotFoundException)
                throw err;
            this.logger.error(`Error buscando ticket con "${raw}": ${err.message}`, err.stack);
            throw new NotFoundException(`No se encontró ningún ticket con "${raw}"`);
        }
    }
    async create(dto) {
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
            };
        }
        const prioridad = dto.prioridad || PrioridadTicket.MEDIA;
        const ticket = this.ticketRepo.create({
            ...dto,
            prioridad,
        });
        const saved = await this.ticketRepo.save(ticket);
        this.notificacionesGateway.emitirNuevoTicket(saved);
        this.logger.log(`🎫 Ticket "${saved.titulo}" creado (${saved.prioridad})`);
        return saved;
    }
    async update(id, dto) {
        const ticket = await this.findOne(id);
        const estadoAnterior = ticket.estado;
        for (const [key, val] of Object.entries(dto)) {
            if (val !== undefined) {
                ticket[key] = val;
            }
        }
        if (dto.estado === EstadoTicket.RESUELTO && estadoAnterior !== EstadoTicket.RESUELTO) {
            ticket.resueltoEn = new Date();
        }
        await this.ticketRepo.save(ticket);
        const updated = await this.findOne(id);
        this.notificacionesGateway.emitirTicketActualizado(updated);
        return updated;
    }
    async remove(id) {
        const ticket = await this.findOne(id);
        await this.ticketRepo.remove(ticket);
        this.notificacionesGateway.emitirTicketEliminado(id);
        this.logger.log(`🗑️ Ticket "${ticket.titulo}" eliminado`);
    }
    async getEstadisticas() {
        const total = await this.ticketRepo.count();
        const abiertos = await this.ticketRepo.count({ where: { estado: EstadoTicket.ABIERTO } });
        const enProgreso = await this.ticketRepo.count({ where: { estado: EstadoTicket.EN_PROGRESO } });
        const resueltos = await this.ticketRepo.count({ where: { estado: EstadoTicket.RESUELTO } });
        return { total, abiertos, enProgreso, resueltos };
    }
    async getAnalytics(sedeFiltro) {
        const allTickets = await this.ticketRepo.find();
        const sedesSet = new Set();
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
        const porSedeMap = {};
        for (const t of allTickets) {
            const s = (t.sede && t.sede.trim()) ? t.sede.trim() : 'Sin Asignar';
            if (!porSedeMap[s]) {
                porSedeMap[s] = { total: 0, resueltos: 0, sumaSLADias: 0, resueltosConFechas: 0, criticos: 0, abiertos: 0 };
            }
            porSedeMap[s].total++;
            if (t.estado === EstadoTicket.RESUELTO || t.estado === EstadoTicket.CERRADO) {
                porSedeMap[s].resueltos++;
            }
            else {
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
        const isFiltrado = Boolean(sedeFiltro && sedeFiltro !== 'TODAS');
        const tickets = isFiltrado
            ? allTickets.filter(t => (t.sede || '').trim().toLowerCase() === sedeFiltro.trim().toLowerCase())
            : allTickets;
        const deptPrioridadMap = {};
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
            if (t.resueltoEn && t.creadoEn) {
                const ms = new Date(t.resueltoEn).getTime() - new Date(t.creadoEn).getTime();
                const dias = ms / (1000 * 60 * 60 * 24);
                sumaSLADias += dias;
                resueltosConFechas++;
            }
        }
        const promedioSLADias = resueltosConFechas > 0 ? (sumaSLADias / resueltosConFechas) : 0;
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
};
TicketsService = TicketsService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Ticket)),
    __metadata("design:paramtypes", [Repository,
        NotificacionesGateway])
], TicketsService);
export { TicketsService };
//# sourceMappingURL=tickets.service.js.map