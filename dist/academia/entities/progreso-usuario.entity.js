var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
let ProgresoUsuario = class ProgresoUsuario {
    id;
    usuario;
    usuarioId;
    nivel;
    nivelId;
    completado;
    puntajeMaximo;
    fechaCompletado;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ProgresoUsuario.prototype, "id", void 0);
__decorate([
    ManyToOne('Usuario', { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'usuarioId' }),
    __metadata("design:type", Object)
], ProgresoUsuario.prototype, "usuario", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], ProgresoUsuario.prototype, "usuarioId", void 0);
__decorate([
    ManyToOne('NivelAcademia', { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'nivelId' }),
    __metadata("design:type", Object)
], ProgresoUsuario.prototype, "nivel", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], ProgresoUsuario.prototype, "nivelId", void 0);
__decorate([
    Column({ default: false }),
    __metadata("design:type", Boolean)
], ProgresoUsuario.prototype, "completado", void 0);
__decorate([
    Column({ default: 0 }),
    __metadata("design:type", Number)
], ProgresoUsuario.prototype, "puntajeMaximo", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], ProgresoUsuario.prototype, "fechaCompletado", void 0);
ProgresoUsuario = __decorate([
    Entity('progreso_academia')
], ProgresoUsuario);
export { ProgresoUsuario };
//# sourceMappingURL=progreso-usuario.entity.js.map