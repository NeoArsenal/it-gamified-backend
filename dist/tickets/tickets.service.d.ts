import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { UpdateTicketDto } from './dto/update-ticket.dto.js';
import { GamificacionService } from '../gamificacion/gamificacion.service.js';
export declare class TicketsService {
    private readonly ticketRepo;
    private readonly gamificacionService;
    private readonly logger;
    constructor(ticketRepo: Repository<Ticket>, gamificacionService: GamificacionService);
    findAll(): Promise<Ticket[]>;
    findOne(id: string): Promise<Ticket>;
    create(dto: CreateTicketDto): Promise<Ticket>;
    update(id: string, dto: UpdateTicketDto): Promise<Ticket>;
    remove(id: string): Promise<void>;
    getEstadisticas(): Promise<{
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
}
