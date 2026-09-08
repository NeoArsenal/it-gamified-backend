var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
export var EstadoIP;
(function (EstadoIP) {
    EstadoIP["LIBRE"] = "LIBRE";
    EstadoIP["OCUPADA"] = "OCUPADA";
    EstadoIP["RESERVADA"] = "RESERVADA";
})(EstadoIP || (EstadoIP = {}));
let DireccionIP = class DireccionIP {
    ip;
    sede;
    area;
    vlan;
    estado;
    dispositivo;
    dispositivoId;
};
__decorate([
    PrimaryColumn(),
    __metadata("design:type", String)
], DireccionIP.prototype, "ip", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], DireccionIP.prototype, "sede", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], DireccionIP.prototype, "area", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], DireccionIP.prototype, "vlan", void 0);
__decorate([
    Column({ type: 'varchar', default: EstadoIP.LIBRE }),
    __metadata("design:type", String)
], DireccionIP.prototype, "estado", void 0);
__decorate([
    ManyToOne('DispositivoRed', (d) => d.direccionesIP, { nullable: true, onDelete: 'SET NULL' }),
    JoinColumn({ name: 'dispositivoId' }),
    __metadata("design:type", Object)
], DireccionIP.prototype, "dispositivo", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], DireccionIP.prototype, "dispositivoId", void 0);
DireccionIP = __decorate([
    Entity('direcciones_ip')
], DireccionIP);
export { DireccionIP };
//# sourceMappingURL=direccion-ip.entity.js.map