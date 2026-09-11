var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
export var EstadoTicket;
(function (EstadoTicket) {
    EstadoTicket["ABIERTO"] = "ABIERTO";
    EstadoTicket["EN_PROGRESO"] = "EN_PROGRESO";
    EstadoTicket["RESUELTO"] = "RESUELTO";
    EstadoTicket["CERRADO"] = "CERRADO";
})(EstadoTicket || (EstadoTicket = {}));
export var PrioridadTicket;
(function (PrioridadTicket) {
    PrioridadTicket["BAJA"] = "BAJA";
    PrioridadTicket["MEDIA"] = "MEDIA";
    PrioridadTicket["ALTA"] = "ALTA";
    PrioridadTicket["CRITICA"] = "CRITICA";
})(PrioridadTicket || (PrioridadTicket = {}));
export const XP_POR_PRIORIDAD = {
    [PrioridadTicket.BAJA]: 50,
    [PrioridadTicket.MEDIA]: 150,
    [PrioridadTicket.ALTA]: 500,
    [PrioridadTicket.CRITICA]: 1000,
};
let Ticket = class Ticket {
    id;
    titulo;
    descripcion;
    estado;
    prioridad;
    xpRecompensa;
    asignadoA;
    asignadoAId;
    solicitante;
    departamento;
    sede;
    ubicacionEspecifica;
    solicitanteNombre;
    solicitanteContacto;
    creadoEn;
    resueltoEn;
    solucion;
    actualizadoEn;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Ticket.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Ticket.prototype, "titulo", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "descripcion", void 0);
__decorate([
    Column({ type: 'varchar', default: EstadoTicket.ABIERTO }),
    __metadata("design:type", String)
], Ticket.prototype, "estado", void 0);
__decorate([
    Column({ type: 'varchar', default: PrioridadTicket.MEDIA }),
    __metadata("design:type", String)
], Ticket.prototype, "prioridad", void 0);
__decorate([
    Column({ default: 150 }),
    __metadata("design:type", Number)
], Ticket.prototype, "xpRecompensa", void 0);
__decorate([
    ManyToOne('Usuario', (u) => u.tickets, { nullable: true, eager: true }),
    JoinColumn({ name: 'asignadoAId' }),
    __metadata("design:type", Object)
], Ticket.prototype, "asignadoA", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "asignadoAId", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "solicitante", void 0);
__decorate([
    Column({ nullable: true, default: 'General' }),
    __metadata("design:type", String)
], Ticket.prototype, "departamento", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "sede", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "ubicacionEspecifica", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "solicitanteNombre", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "solicitanteContacto", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Ticket.prototype, "creadoEn", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Date)
], Ticket.prototype, "resueltoEn", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "solucion", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Ticket.prototype, "actualizadoEn", void 0);
Ticket = __decorate([
    Entity('tickets')
], Ticket);
export { Ticket };
//# sourceMappingURL=ticket.entity.js.map