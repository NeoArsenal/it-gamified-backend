import { Repository } from 'typeorm';
import { Ticket, EstadoTicket, PrioridadTicket } from './entities/ticket.entity.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { NotificacionesGateway } from '../notificaciones/notificaciones.gateway.js';
import { PushNotificationService } from '../notificaciones/push-notification.service.js';
import { StorageService } from '../storage/storage.service.js';
export declare class TicketsService {
    private readonly ticketRepo;
    private readonly notificacionesGateway;
    private readonly pushNotificationService;
    private readonly storageService;
    private readonly logger;
    constructor(ticketRepo: Repository<Ticket>, notificacionesGateway: NotificacionesGateway, pushNotificationService: PushNotificationService, storageService: StorageService);
    findAll(): Promise<Ticket[]>;
    findAllPublic(): Promise<Partial<Ticket>[]>;
    findOne(id: string): Promise<Ticket>;
    getActivePublicTickets(): Promise<{
        id: string;
        ticketCode: string;
        titulo: string;
        descripcion: string;
        estado: EstadoTicket;
        prioridad: PrioridadTicket;
        sede: string;
        departamento: string;
        ubicacionEspecifica: string;
        solicitanteNombre: string;
        creadoEn: Date;
        actualizadoEn: Date;
        resueltoEn: Date;
        solucion: string;
        fotoUrl: string;
        tecnicoAsignado: {
            nombre: string;
            avatar: string;
            rol: import("../usuarios/entities/usuario.entity.js").RolUsuario;
        };
    }[]>;
    trackTicket(query: string): Promise<{
        id: string;
        ticketCode: string;
        titulo: string;
        descripcion: string;
        estado: EstadoTicket;
        prioridad: PrioridadTicket;
        sede: string;
        departamento: string;
        ubicacionEspecifica: string;
        solicitanteNombre: string;
        creadoEn: Date;
        actualizadoEn: Date;
        resueltoEn: Date;
        solucion: string;
        fotoUrl: string;
        tecnicoAsignado: {
            nombre: string;
            avatar: string;
            rol: import("../usuarios/entities/usuario.entity.js").RolUsuario;
        };
    }[]>;
    create(dto: CreateTicketDto): Promise<Ticket>;
    update(id: string, dto: UpdateTicketDto): Promise<Ticket>;
    remove(id: string): Promise<void>;
    getEstadisticas(): Promise<{
        total: number;
        abiertos: number;
        enProgreso: number;
        resueltos: number;
    }>;
    getAnalytics(sedeFiltro?: string): Promise<{
        heatmapDept: {
            departamento: string;
            BAJA: number;
            MEDIA: number;
            ALTA: number;
            CRITICA: number;
            total: number;
        }[];
        promedioSLADias: number;
        totalTickets: number;
        resueltosCount: number;
        sedesDisponibles: string[];
        porSede: {
            sede: string;
            total: number;
            resueltos: number;
            abiertos: number;
            criticos: number;
            promedioSLADias: number;
            promedioSLAHoras: number;
            porcentajeResolucion: number;
        }[];
        sedeActiva: string;
        totalTicketsGlobal: number;
    }>;
}
