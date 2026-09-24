import 'multer';
import { TicketsService } from './tickets.service.js';
import { StorageService } from '../storage/storage.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
export declare class TicketsController {
    private readonly ticketsService;
    private readonly storageService;
    constructor(ticketsService: TicketsService, storageService: StorageService);
    findAllPublic(): Promise<Partial<import("./entities/ticket.entity.js").Ticket>[]>;
    getActivePublic(): Promise<{
        id: string;
        ticketCode: string;
        titulo: string;
        descripcion: string;
        estado: import("./entities/ticket.entity.js").EstadoTicket;
        prioridad: import("./entities/ticket.entity.js").PrioridadTicket;
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
        estado: import("./entities/ticket.entity.js").EstadoTicket;
        prioridad: import("./entities/ticket.entity.js").PrioridadTicket;
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
    findAll(): Promise<import("./entities/ticket.entity.js").Ticket[]>;
    getStats(): Promise<{
        total: number;
        abiertos: number;
        enProgreso: number;
        resueltos: number;
    }>;
    getAnalytics(sede?: string): Promise<{
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
    findOne(id: string): Promise<import("./entities/ticket.entity.js").Ticket>;
    uploadFoto(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    create(dto: CreateTicketDto): Promise<import("./entities/ticket.entity.js").Ticket>;
    update(id: string, dto: UpdateTicketDto): Promise<import("./entities/ticket.entity.js").Ticket>;
    remove(id: string): Promise<void>;
}
