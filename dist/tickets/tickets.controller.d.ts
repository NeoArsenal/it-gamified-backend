import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    findAllPublic(): Promise<Partial<import("./entities/ticket.entity.js").Ticket>[]>;
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
    create(dto: CreateTicketDto): Promise<import("./entities/ticket.entity.js").Ticket>;
    update(id: string, dto: UpdateTicketDto): Promise<import("./entities/ticket.entity.js").Ticket>;
    remove(id: string): Promise<void>;
}
