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
export var AccionXP;
(function (AccionXP) {
    AccionXP["TICKET_RESUELTO"] = "TICKET_RESUELTO";
    AccionXP["GUIA_SUBIDA"] = "GUIA_SUBIDA";
    AccionXP["MISION_COMPLETADA"] = "MISION_COMPLETADA";
    AccionXP["BONUS_ADMIN"] = "BONUS_ADMIN";
})(AccionXP || (AccionXP = {}));
let HistorialXP = class HistorialXP {
    id;
    usuario;
    usuarioId;
    accion;
    descripcion;
    xpOtorgado;
    fecha;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], HistorialXP.prototype, "id", void 0);
__decorate([
    ManyToOne('Usuario', (u) => u.historialXP, { onDelete: 'CASCADE' }),
    JoinColumn({ name: 'usuarioId' }),
    __metadata("design:type", Object)
], HistorialXP.prototype, "usuario", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], HistorialXP.prototype, "usuarioId", void 0);
__decorate([
    Column({ type: 'varchar' }),
    __metadata("design:type", String)
], HistorialXP.prototype, "accion", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], HistorialXP.prototype, "descripcion", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], HistorialXP.prototype, "xpOtorgado", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], HistorialXP.prototype, "fecha", void 0);
HistorialXP = __decorate([
    Entity('historial_xp')
], HistorialXP);
export { HistorialXP };
//# sourceMappingURL=historial-xp.entity.js.map