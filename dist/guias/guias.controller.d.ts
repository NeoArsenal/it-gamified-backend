import { GuiasService } from './guias.service.js';
export declare class GuiasController {
    private readonly guiasService;
    constructor(guiasService: GuiasService);
    findAll(): Promise<import("./entities/guia.entity.js").Guia[]>;
    findOne(id: string): Promise<import("./entities/guia.entity.js").Guia>;
    create(data: any): Promise<import("./entities/guia.entity.js").Guia>;
    remove(id: string): Promise<void>;
}
