import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import { Medalla } from '../gamificacion/entities/medalla.entity.js';
import { Ticket } from '../tickets/entities/ticket.entity.js';
import { DispositivoRed } from '../red/entities/dispositivo-red.entity.js';
import { DireccionIP } from '../red/entities/direccion-ip.entity.js';
import { Guia } from '../guias/entities/guia.entity.js';
export declare class SeedService implements OnModuleInit {
    private readonly usuarioRepo;
    private readonly medallaRepo;
    private readonly ticketRepo;
    private readonly dispositivoRepo;
    private readonly ipRepo;
    private readonly guiaRepo;
    private readonly logger;
    constructor(usuarioRepo: Repository<Usuario>, medallaRepo: Repository<Medalla>, ticketRepo: Repository<Ticket>, dispositivoRepo: Repository<DispositivoRed>, ipRepo: Repository<DireccionIP>, guiaRepo: Repository<Guia>);
    onModuleInit(): Promise<void>;
    private seed;
}
