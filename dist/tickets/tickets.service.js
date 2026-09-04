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
import { Ticket, EstadoTicket, PrioridadTicket, XP_POR_PRIORIDAD } from './entities/ticket.entity.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
import { AccionXP } from '../gamificacion/entities/historial-xp.entity.js';
let TicketsService = TicketsService_1 = class TicketsService {
    ticketRepo;
    gamificacionService;
    logger = new Logger(TicketsService_1.name);
    constructor(ticketRepo, gamificacionService) {
        this.ticketRepo = ticketRepo;
        this.gamificacionService = gamificacionService;
    }
    async findAll() {
        return this.ticketRepo.find({ order: { creadoEn: 'DESC' } });
    }
    async findOne(id) {
        const ticket = await this.ticketRepo.findOneBy({ id });
        if (!ticket)
            throw new NotFoundException(`Ticket ${id} no encontrado`);
        return ticket;
    }
    async create(dto) {
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
    async update(id, dto) {
        const ticket = await this.findOne(id);
        const estadoAnterior = ticket.estado;
        Object.assign(ticket, dto);
        if (dto.prioridad) {
            ticket.xpRecompensa = XP_POR_PRIORIDAD[dto.prioridad];
        }
        if (dto.estado === EstadoTicket.RESUELTO && estadoAnterior !== EstadoTicket.RESUELTO) {
            ticket.resueltoEn = new Date();
            if (ticket.asignadoAId) {
                const resultado = await this.gamificacionService.otorgarXP(ticket.asignadoAId, ticket.xpRecompensa, AccionXP.TICKET_RESUELTO, `Resolvió ticket "${ticket.titulo}" (${ticket.prioridad})`);
                this.logger.log(`⚡ +${resultado.xpOtorgado} XP → Técnico ahora tiene ${resultado.nuevoXP} XP (Nivel ${resultado.nivel})`);
            }
        }
        return this.ticketRepo.save(ticket);
    }
    async remove(id) {
        const ticket = await this.findOne(id);
        await this.ticketRepo.remove(ticket);
    }
    async getEstadisticas() {
        const total = await this.ticketRepo.count();
        const abiertos = await this.ticketRepo.count({ where: { estado: EstadoTicket.ABIERTO } });
        const enProgreso = await this.ticketRepo.count({ where: { estado: EstadoTicket.EN_PROGRESO } });
        const resueltos = await this.ticketRepo.count({ where: { estado: EstadoTicket.RESUELTO } });
        return { total, abiertos, enProgreso, resueltos };
    }
    async getAnalytics() {
        const tickets = await this.ticketRepo.find();
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
            if (t.estado === EstadoTicket.RESUELTO && t.resueltoEn && t.creadoEn) {
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
            resueltosCount: resueltosConFechas
        };
    }
};
TicketsService = TicketsService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Ticket)),
    __metadata("design:paramtypes", [Repository,
        GamificacionService])
], TicketsService);
export { TicketsService };
//# sourceMappingURL=tickets.service.js.map