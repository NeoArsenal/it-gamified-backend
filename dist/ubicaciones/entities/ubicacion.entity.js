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
import { Usuario } from '../../usuarios/entities/usuario.entity.js';
let Ubicacion = class Ubicacion {
    id;
    sede;
    departamento;
    area;
    creadoPorId;
    creadoPor;
    creadoEn;
    actualizadoEn;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Ubicacion.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Ubicacion.prototype, "sede", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Ubicacion.prototype, "departamento", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Ubicacion.prototype, "area", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Ubicacion.prototype, "creadoPorId", void 0);
__decorate([
    ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' }),
    JoinColumn({ name: 'creadoPorId' }),
    __metadata("design:type", Usuario)
], Ubicacion.prototype, "creadoPor", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Ubicacion.prototype, "creadoEn", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Ubicacion.prototype, "actualizadoEn", void 0);
Ubicacion = __decorate([
    Entity('ubicaciones')
], Ubicacion);
export { Ubicacion };
//# sourceMappingURL=ubicacion.entity.js.map