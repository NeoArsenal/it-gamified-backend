var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
export var EstadoActivo;
(function (EstadoActivo) {
    EstadoActivo["REPARACION"] = "REPARACION";
    EstadoActivo["BAJA"] = "BAJA";
    EstadoActivo["RESCATADO"] = "RESCATADO";
})(EstadoActivo || (EstadoActivo = {}));
let Activo = class Activo {
    id;
    codigo;
    tipo;
    estado;
    observaciones;
    intervenciones;
    fechaRegistro;
    fechaActualizacion;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Activo.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Activo.prototype, "codigo", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Activo.prototype, "tipo", void 0);
__decorate([
    Column({
        type: 'varchar',
        enum: EstadoActivo,
        default: EstadoActivo.REPARACION
    }),
    __metadata("design:type", String)
], Activo.prototype, "estado", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Activo.prototype, "observaciones", void 0);
__decorate([
    OneToMany('Intervencion', (i) => i.activo, { eager: true }),
    __metadata("design:type", Object)
], Activo.prototype, "intervenciones", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Activo.prototype, "fechaRegistro", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Activo.prototype, "fechaActualizacion", void 0);
Activo = __decorate([
    Entity('activos')
], Activo);
export { Activo };
//# sourceMappingURL=activo.entity.js.map