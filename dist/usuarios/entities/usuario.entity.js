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
export var RolUsuario;
(function (RolUsuario) {
    RolUsuario["ADMIN"] = "ADMIN";
    RolUsuario["TECNICO"] = "TECNICO";
})(RolUsuario || (RolUsuario = {}));
let Usuario = class Usuario {
    id;
    nombre;
    email;
    password;
    rol;
    nivel;
    xpActual;
    avatar;
    tituloRPG;
    preferencias;
    modulosAccesibles;
    tickets;
    historialXP;
    medallas;
    guias;
    creadoEn;
    actualizadoEn;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Usuario.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Usuario.prototype, "nombre", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    Column({ select: false }),
    __metadata("design:type", String)
], Usuario.prototype, "password", void 0);
__decorate([
    Column({ type: 'varchar', default: RolUsuario.TECNICO }),
    __metadata("design:type", String)
], Usuario.prototype, "rol", void 0);
__decorate([
    Column({ default: 1 }),
    __metadata("design:type", Number)
], Usuario.prototype, "nivel", void 0);
__decorate([
    Column({ default: 0 }),
    __metadata("design:type", Number)
], Usuario.prototype, "xpActual", void 0);
__decorate([
    Column({ default: '' }),
    __metadata("design:type", String)
], Usuario.prototype, "avatar", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "tituloRPG", void 0);
__decorate([
    Column({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Usuario.prototype, "preferencias", void 0);
__decorate([
    Column({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Usuario.prototype, "modulosAccesibles", void 0);
__decorate([
    OneToMany('Ticket', (ticket) => ticket.asignadoA),
    __metadata("design:type", Object)
], Usuario.prototype, "tickets", void 0);
__decorate([
    OneToMany('HistorialXP', (h) => h.usuario),
    __metadata("design:type", Object)
], Usuario.prototype, "historialXP", void 0);
__decorate([
    OneToMany('UsuarioMedalla', (um) => um.usuario),
    __metadata("design:type", Object)
], Usuario.prototype, "medallas", void 0);
__decorate([
    OneToMany('Guia', (g) => g.autor),
    __metadata("design:type", Object)
], Usuario.prototype, "guias", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Usuario.prototype, "creadoEn", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Usuario.prototype, "actualizadoEn", void 0);
Usuario = __decorate([
    Entity('usuarios')
], Usuario);
export { Usuario };
//# sourceMappingURL=usuario.entity.js.map