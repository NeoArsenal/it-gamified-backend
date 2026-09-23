import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity.js';
import { UsuariosController } from './usuarios.controller.js';
import { UsuariosService } from './usuarios.service.js';
import { StorageModule } from '../storage/storage.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    StorageModule,
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [TypeOrmModule, UsuariosService],
})
export class UsuariosModule {}
