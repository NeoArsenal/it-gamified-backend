var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
let Curso = class Curso {
    id;
    titulo;
    descripcion;
    icono;
    orden;
    niveles;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Curso.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Curso.prototype, "titulo", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Curso.prototype, "descripcion", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Curso.prototype, "icono", void 0);
__decorate([
    Column({ default: 1 }),
    __metadata("design:type", Number)
], Curso.prototype, "orden", void 0);
__decorate([
    OneToMany('NivelAcademia', (nivel) => nivel.curso),
    __metadata("design:type", Object)
], Curso.prototype, "niveles", void 0);
Curso = __decorate([
    Entity('cursos')
], Curso);
export { Curso };
//# sourceMappingURL=curso.entity.js.map