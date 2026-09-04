import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    findAll(): Promise<import("./entities/ticket.entity.js").Ticket[]>;
    getStats(): Promise<{
        total: number;
        abiertos: number;
        enProgreso: number;
        resueltos: number;
    }>;
    getAnalytics(): Promise<{
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
    }>;
    findOne(id: string): Promise<import("./entities/ticket.entity.js").Ticket>;
    create(dto: CreateTicketDto): Promise<import("./entities/ticket.entity.js").Ticket>;
    update(id: string, dto: UpdateTicketDto): Promise<import("./entities/ticket.entity.js").Ticket>;
    remove(id: string): Promise<void>;
}
