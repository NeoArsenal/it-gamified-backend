import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;
  private bucket: string;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');
    this.bucket = this.configService.get<string>('SUPABASE_BUCKET') || 'helpdesk-archivos';

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  async uploadFile(file: Express.Multer.File, path: string = 'uploads'): Promise<string> {
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

    // Obtener la URL pública
    const { data: publicUrlData } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  }
}
