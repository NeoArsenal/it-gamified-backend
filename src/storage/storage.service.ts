import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import 'multer';
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

    let uploadRes = await this.supabase.storage
      .from(this.bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadRes.error) {
      console.error('Error subiendo archivo a Supabase:', uploadRes.error);

      // Si el bucket no existe, intentar crearlo automáticamente como público
      if (
        uploadRes.error.message?.includes('Bucket not found') ||
        (uploadRes.error as any).statusCode === '404' ||
        uploadRes.error.message?.includes('not found')
      ) {
        try {
          const { error: createError } = await this.supabase.storage.createBucket(this.bucket, {
            public: true,
          });
          if (!createError) {
            uploadRes = await this.supabase.storage
              .from(this.bucket)
              .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
              });
          }
        } catch (e) {
          console.error('Error intentando auto-crear bucket:', e);
        }
      }

      if (uploadRes.error) {
        const msg = uploadRes.error.message || '';
        if (msg.includes('JWS') || msg.includes('JWT') || (uploadRes.error as any).code === 'AccessDenied') {
          throw new InternalServerErrorException(
            'Error de autenticación con Supabase Storage: la clave SUPABASE_SERVICE_KEY no es válida (debe ser el service_role secret JWT que empieza con eyJhbG...).',
          );
        }
        throw new InternalServerErrorException(`Error al subir archivo a Supabase: ${uploadRes.error.message}`);
      }
    }

    // Obtener la URL pública
    const { data: publicUrlData } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  }
}
