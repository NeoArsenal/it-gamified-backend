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
let Guia = class Guia {
    id;
    titulo;
    urlPdf;
    peso;
    autor;
    autorId;
    fechaSubida;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Guia.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Guia.prototype, "titulo", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Guia.prototype, "urlPdf", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Guia.prototype, "peso", void 0);
__decorate([
    ManyToOne('Usuario', (u) => u.guias, { eager: true, nullable: true }),
    JoinColumn({ name: 'autorId' }),
    __metadata("design:type", Object)
], Guia.prototype, "autor", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Guia.prototype, "autorId", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Guia.prototype, "fechaSubida", void 0);
Guia = __decorate([
    Entity('guias')
], Guia);
export { Guia };
//# sourceMappingURL=guia.entity.js.map