import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolUsuario, Usuario } from './entities/usuario.entity.js';

@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @UseGuards(RolesGuard)
  @Roles(RolUsuario.ADMIN)
  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(RolUsuario.ADMIN)
  @Post()
  createUsuario(@Body() body: Partial<Usuario>) {
    return this.usuariosService.createUsuario(body);
  }

  @UseGuards(RolesGuard)
  @Roles(RolUsuario.ADMIN)
  @Patch(':id')
  updateUsuario(@Param('id') id: string, @Body() body: Partial<Usuario>) {
    return this.usuariosService.updateUsuario(id, body);
  }

  @UseGuards(RolesGuard)
  @Roles(RolUsuario.ADMIN)
  @Delete(':id')
  deleteUsuario(@Param('id') id: string, @Req() req: any) {
    const currentUserId = req.user?.id;
    return this.usuariosService.deleteUsuario(id, currentUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id/preferencias')
  updatePreferencias(
    @Param('id') id: string,
    @Body() body: { avatar?: string; tituloRPG?: string; preferencias?: any }
  ) {
    return this.usuariosService.updatePreferencias(id, body);
  }
}
