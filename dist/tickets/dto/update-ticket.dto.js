var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { EstadoTicket, PrioridadTicket } from '../entities/ticket.entity.js';
export class UpdateTicketDto {
    titulo;
    descripcion;
    estado;
    prioridad;
    asignadoAId;
    solucion;
}
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "titulo", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "descripcion", void 0);
__decorate([
    IsEnum(EstadoTicket),
    IsOptional(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "estado", void 0);
__decorate([
    IsEnum(PrioridadTicket),
    IsOptional(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "prioridad", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "asignadoAId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "solucion", void 0);
//# sourceMappingURL=update-ticket.dto.js.map