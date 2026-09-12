import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, RolUsuario } from './entities/usuario.entity.js';

@Injectable()
export class UsuariosService {
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

    await this.dataSource.transaction(async (manager) => {
      // Desvincular referencias que no tengan CASCADE
      await manager.query(`UPDATE tickets SET "asignadoAId" = NULL WHERE "asignadoAId" = $1`, [id]).catch(() => {});
      await manager.query(`UPDATE guias SET "autorId" = NULL WHERE "autorId" = $1`, [id]).catch(() => {});
      await manager.query(`UPDATE ubicaciones SET "creadoPorId" = NULL WHERE "creadoPorId" = $1`, [id]).catch(() => {});
      await manager.query(`UPDATE intervenciones SET "tecnicoId" = NULL WHERE "tecnicoId" = $1`, [id]).catch(() => {});
      await manager.query(`UPDATE activos SET "responsableId" = NULL WHERE "responsableId" = $1`, [id]).catch(() => {});

      await manager.remove(user);
    });

    return { success: true, message: `Usuario ${user.nombre} eliminado correctamente` };
  }
}
