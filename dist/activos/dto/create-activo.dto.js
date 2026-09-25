var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsNotEmpty, MaxLength, IsEnum } from 'class-validator';
import { EstadoActivo } from '../entities/activo.entity.js';
export class CreateActivoDto {
    codigo;
    tipo;
    estado;
    marca;
    modelo;
    numeroSerie;
    codigoFactura;
    sede;
    departamento;
    ubicacion;
    responsable;
    observaciones;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'El código patrimonial es obligatorio' }),
    MaxLength(50, { message: 'El código no puede superar los 50 caracteres' }),
    __metadata("design:type", String)
], CreateActivoDto.prototype, "codigo", void 0);
__decorate([
    IsString(),
    IsNotEmpty({ message: 'El tipo de equipo es obligatorio' }),
    MaxLength(50, { message: 'El tipo no puede superar los 50 caracteres' }),
    __metadata("design:type", String)
], CreateActivoDto.prototype, "tipo", void 0);
__decorate([
    IsOptional(),
    IsEnum(EstadoActivo, { message: 'El estado del activo no es válido' }),
    __metadata("design:type", String)
], CreateActivoDto.prototype, "estado", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(60, { message: 'La marca no puede superar los 60 caracteres' }),
    __metadata("design:type", String)
], CreateActivoDto.prototype, "marca", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(80, { message: 'El modelo no puede superar los 80 caracteres' }),
    __metadata("design:type", String)
], CreateActivoDto.prototype, "modelo", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(80, { message: 'El número de serie no puede superar los 80 caracteres' }),
    __metadata("design:type", String)
], CreateActivoDto.prototype, "numeroSerie", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(60, { message: 'El código de factura no puede superar los 60 caracteres' }),
    __metadata("design:type", String)
], CreateActivoDto.prototype, "codigoFactura", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(60, { message: 'La sede no puede superar los 60 caracteres' }),
    __metadata("design:type", String)
], CreateActivoDto.prototype, "sede", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(80, { message: 'El departamento no puede superar los 80 caracteres' }),
    __metadata("design:type", String)
], CreateActivoDto.prototype, "departamento", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(120, { message: 'La ubicación no puede superar los 120 caracteres' }),
    __metadata("design:type", String)
], CreateActivoDto.prototype, "ubicacion", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(100, { message: 'El responsable no puede superar los 100 caracteres' }),
    __metadata("design:type", String)
], CreateActivoDto.prototype, "responsable", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(1000, { message: 'Las observaciones no pueden superar los 1000 caracteres' }),
    __metadata("design:type", String)
], CreateActivoDto.prototype, "observaciones", void 0);
//# sourceMappingURL=create-activo.dto.js.map