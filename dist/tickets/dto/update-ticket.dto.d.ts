import { EstadoTicket, PrioridadTicket } from '../entities/ticket.entity.js';
export declare class UpdateTicketDto {
    titulo?: string;
    descripcion?: string;
    estado?: EstadoTicket;
    prioridad?: PrioridadTicket;
    asignadoAId?: string;
}
