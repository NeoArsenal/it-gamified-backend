import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, RolUsuario } from './entities/usuario.entity.js';
import { Ticket } from '../tickets/entities/ticket.entity.js';
import { Guia } from '../guias/entities/guia.entity.js';
import { Ubicacion } from '../ubicaciones/entities/ubicacion.entity.js';
import { Activo } from '../activos/entities/activo.entity.js';
import { Intervencion } from '../activos/entities/intervencion.entity.js';
import { Configuracion } from '../configuracion/entities/configuracion.entity.js';
import { UsuarioMedalla } from '../gamificacion/entities/usuario-medalla.entity.js';
import { HistorialXP } from '../gamificacion/entities/historial-xp.entity.js';
import { ProgresoUsuario } from '../academia/entities/progreso-usuario.entity.js';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  async createUsuario(data: Partial<Usuario>): Promise<Usuario> {
    const existingUser = await this.usuarioRepository.findOne({ where: { email: data.email } });
    if (existingUser) throw new BadRequestException('El correo ya está registrado');

    const hash = await bcrypt.hash(data.password || '123456', 10);
    const user = this.usuarioRepository.create({
      ...data,
      password: hash,
      modulosAccesibles: data.modulosAccesibles || ['dashboard', 'tickets', 'knowledge', 'academy', 'settings']
    });
    return this.usuarioRepository.save(user);
  }

  async updateUsuario(id: string, data: Partial<Usuario>): Promise<Usuario> {
    const user = await this.findOne(id);
    if (data.nombre) user.nombre = data.nombre;
    if (data.email) user.email = data.email;
    if (data.rol) user.rol = data.rol;
    if (data.modulosAccesibles) user.modulosAccesibles = data.modulosAccesibles;
    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }
    return this.usuarioRepository.save(user);
  }

  async updatePreferencias(id: string, data: { avatar?: string; tituloRPG?: string; preferencias?: any }): Promise<Usuario> {
    const usuario = await this.findOne(id);
    
    if (data.avatar !== undefined) usuario.avatar = data.avatar;
    if (data.tituloRPG !== undefined) usuario.tituloRPG = data.tituloRPG;
    if (data.preferencias !== undefined) {
      usuario.preferencias = {
        ...(usuario.preferencias || {}),
        ...data.preferencias
      };
    }

    return this.usuarioRepository.save(usuario);
  }

  async deleteUsuario(id: string, currentUserId?: string): Promise<{ success: boolean; message: string }> {
    if (currentUserId && id === currentUserId) {
      throw new BadRequestException('No puedes eliminar tu propia cuenta de administrador en sesión');
    }

    const user = await this.findOne(id);

    try {
      await this.dataSource.transaction(async (manager) => {
        // 1. Eliminar gamificación y progreso asociados al usuario
        await manager.delete(UsuarioMedalla, { usuarioId: id });
        await manager.delete(HistorialXP, { usuarioId: id });
        await manager.delete(ProgresoUsuario, { usuarioId: id });

        // 2. Desvincular relaciones laborales/históricas (preservar tickets, guías y registros)
        await manager.update(Ticket, { asignadoAId: id }, { asignadoAId: null });
        await manager.update(Guia, { autorId: id }, { autorId: null });
        await manager.update(Ubicacion, { creadoPorId: id }, { creadoPorId: null });
        await manager.update(Intervencion, { tecnicoId: id }, { tecnicoId: null });
        await manager.update(Activo, { registradoPorId: id }, { registradoPorId: null });
        await manager.update(Configuracion, { actualizadoPorId: id }, { actualizadoPorId: null });

        // 3. Eliminar el usuario de la base de datos
        await manager.delete(Usuario, { id });
      });

      this.logger.log(`Usuario ${user.nombre} (${user.email}) eliminado exitosamente`);
      return { success: true, message: `Usuario ${user.nombre} eliminado correctamente` };
    } catch (error: any) {
      this.logger.error(`Error al eliminar usuario ${id}: ${error.message}`, error.stack);
      throw new BadRequestException(`No se pudo eliminar el usuario: ${error.message}`);
    }
  }
}
