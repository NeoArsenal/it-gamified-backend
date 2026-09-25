var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
export class CreateIntervencionDto {
    descripcion;
    tecnicoId;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'La descripción de la intervención es obligatoria' }),
    MaxLength(500, { message: 'La descripción no puede superar los 500 caracteres' }),
    __metadata("design:type", String)
], CreateIntervencionDto.prototype, "descripcion", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateIntervencionDto.prototype, "tecnicoId", void 0);
//# sourceMappingURL=create-intervencion.dto.js.map