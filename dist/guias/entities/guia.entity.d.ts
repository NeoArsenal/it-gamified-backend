import type { Usuario } from '../../usuarios/entities/usuario.entity.js';
import type { Relation } from 'typeorm';
export declare class Guia {
    id: string;
    titulo: string;
    urlPdf: string;
    peso: string;
    autor: Relation<Usuario>;
    autorId: string;
    fechaSubida: Date;
}
