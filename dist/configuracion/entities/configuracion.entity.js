var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryColumn, Column, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity.js';
let Configuracion = class Configuracion {
    clave;
    valor;
    actualizadoPorId;
    actualizadoPor;
    actualizadoEn;
};
__decorate([
    PrimaryColumn(),
    __metadata("design:type", String)
], Configuracion.prototype, "clave", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Configuracion.prototype, "valor", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Configuracion.prototype, "actualizadoPorId", void 0);
__decorate([
    ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' }),
    JoinColumn({ name: 'actualizadoPorId' }),
    __metadata("design:type", Usuario)
], Configuracion.prototype, "actualizadoPor", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Configuracion.prototype, "actualizadoEn", void 0);
Configuracion = __decorate([
    Entity('configuracion')
], Configuracion);
export { Configuracion };
//# sourceMappingURL=configuracion.entity.js.map