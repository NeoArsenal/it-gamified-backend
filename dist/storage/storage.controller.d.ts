import 'multer';
import { StorageService } from './storage.service.js';
export declare class StorageController {
    private readonly storageService;
    constructor(storageService: StorageService);
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
    }>;
}
