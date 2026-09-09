var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
export var TipoDispositivo;
(function (TipoDispositivo) {
    TipoDispositivo["SWITCH"] = "SWITCH";
    TipoDispositivo["ROUTER"] = "ROUTER";
    TipoDispositivo["ACCESS_POINT"] = "ACCESS_POINT";
    TipoDispositivo["SERVIDOR"] = "SERVIDOR";
})(TipoDispositivo || (TipoDispositivo = {}));
export var EstadoDispositivo;
(function (EstadoDispositivo) {
    EstadoDispositivo["ONLINE"] = "ONLINE";
    EstadoDispositivo["OFFLINE"] = "OFFLINE";
    EstadoDispositivo["WARNING"] = "WARNING";
})(EstadoDispositivo || (EstadoDispositivo = {}));
let DispositivoRed = class DispositivoRed {
    id;
    nombre;
    tipo;
    estado;
    ubicacion;
    ipAdministracion;
    direccionesIP;
    ultimoPing;
    registradoPor;
    registradoPorId;
    creadoEn;
    actualizadoEn;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], DispositivoRed.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], DispositivoRed.prototype, "nombre", void 0);
__decorate([
    Column({ type: 'varchar', default: TipoDispositivo.SWITCH }),
    __metadata("design:type", String)
], DispositivoRed.prototype, "tipo", void 0);
__decorate([
    Column({ type: 'varchar', default: EstadoDispositivo.ONLINE }),
    __metadata("design:type", String)
], DispositivoRed.prototype, "estado", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], DispositivoRed.prototype, "ubicacion", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], DispositivoRed.prototype, "ipAdministracion", void 0);
__decorate([
    OneToMany('DireccionIP', (ip) => ip.dispositivo),
    __metadata("design:type", Object)
], DispositivoRed.prototype, "direccionesIP", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Date)
], DispositivoRed.prototype, "ultimoPing", void 0);
__decorate([
    ManyToOne('Usuario', { nullable: true }),
    JoinColumn({ name: 'registradoPorId' }),
    __metadata("design:type", Object)
], DispositivoRed.prototype, "registradoPor", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], DispositivoRed.prototype, "registradoPorId", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], DispositivoRed.prototype, "creadoEn", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], DispositivoRed.prototype, "actualizadoEn", void 0);
DispositivoRed = __decorate([
    Entity('dispositivos_red')
], DispositivoRed);
export { DispositivoRed };
//# sourceMappingURL=dispositivo-red.entity.js.map