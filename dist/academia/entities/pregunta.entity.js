var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
let Pregunta = class Pregunta {
    id;
    texto;
    opciones;
    respuestaCorrecta;
    explicacion;
    nivelId;
    nivel;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Pregunta.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Pregunta.prototype, "texto", void 0);
__decorate([
    Column({ type: 'json' }),
    __metadata("design:type", Array)
], Pregunta.prototype, "opciones", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Pregunta.prototype, "respuestaCorrecta", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Pregunta.prototype, "explicacion", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Pregunta.prototype, "nivelId", void 0);
__decorate([
    ManyToOne('NivelAcademia', (nivel) => nivel.preguntas),
    __metadata("design:type", Object)
], Pregunta.prototype, "nivel", void 0);
Pregunta = __decorate([
    Entity('preguntas_academia')
], Pregunta);
export { Pregunta };
//# sourceMappingURL=pregunta.entity.js.map