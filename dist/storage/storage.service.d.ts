import { ConfigService } from '@nestjs/config';
import 'multer';
export declare class StorageService {
    private configService;
    private supabase;
    private bucket;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, path?: string): Promise<string>;
    extractPathFromUrl(fileUrlOrPath: string): string | null;
    deleteFile(fileUrlOrPath: string): Promise<boolean>;
}
