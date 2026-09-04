import { PrioridadTicket } from '../entities/ticket.entity.js';
export declare class CreateTicketDto {
    titulo: string;
    descripcion?: string;
    prioridad?: PrioridadTicket;
    asignadoAId?: string;
    solicitante?: string;
    departamento?: string;
}
