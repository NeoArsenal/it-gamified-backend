var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
let StorageService = class StorageService {
    configService;
    supabase;
    bucket;
    constructor(configService) {
        this.configService = configService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseKey = this.configService.get('SUPABASE_SERVICE_KEY');
        this.bucket = this.configService.get('SUPABASE_BUCKET') || 'helpdesk-archivos';
        if (supabaseUrl && supabaseKey) {
            this.supabase = createClient(supabaseUrl, supabaseKey);
        }
    }
    async uploadFile(file, path = 'uploads') {
        if (!this.supabase) {
            throw new InternalServerErrorException('Supabase no está configurado (faltan variables de entorno)');
        }
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${path}/${uuidv4()}.${fileExt}`;
        const { data, error } = await this.supabase.storage
            .from(this.bucket)
            .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });
        if (error) {
            console.error('Error subiendo archivo a Supabase:', error);
            throw new InternalServerErrorException('Error al subir el archivo');
        }
        const { data: publicUrlData } = this.supabase.storage
            .from(this.bucket)
            .getPublicUrl(fileName);
        return publicUrlData.publicUrl;
    }
};
StorageService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], StorageService);
export { StorageService };
//# sourceMappingURL=storage.service.js.map