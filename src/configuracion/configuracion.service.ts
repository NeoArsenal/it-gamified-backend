import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Configuracion } from './entities/configuracion.entity.js';

@Injectable()
export class ConfiguracionService {
  constructor(
    @InjectRepository(Configuracion)
    private configRepo: Repository<Configuracion>
  ) {}

  async getValue(clave: string, defaultValue: string = ''): Promise<string> {
    const config = await this.configRepo.findOne({ where: { clave } });
    return config ? config.valor : defaultValue;
  }

  async setValue(clave: string, valor: string, usuarioId?: string): Promise<Configuracion> {
    let config = await this.configRepo.findOne({ where: { clave } });
    if (!config) {
      config = this.configRepo.create({ clave, valor, actualizadoPorId: usuarioId });
    } else {
      config.valor = valor;
      if (usuarioId) {
        config.actualizadoPorId = usuarioId;
      }
    }
    return this.configRepo.save(config);
  }

  async getPortalToken(): Promise<string> {
    let token = await this.getValue('PORTAL_TOKEN', '');
    if (!token) {
      token = crypto.randomBytes(16).toString('hex');
      await this.setValue('PORTAL_TOKEN', token);
    }
    return token;
  }

  async regeneratePortalToken(usuarioId?: string): Promise<string> {
    const newToken = crypto.randomBytes(16).toString('hex');
    await this.setValue('PORTAL_TOKEN', newToken, usuarioId);
    return newToken;
  }

  async verifyAccess(pin?: string, token?: string): Promise<boolean> {
    if (token) {
      const actualToken = await this.getPortalToken();
      if (token.trim() === actualToken.trim()) {
        return true;
      }
    }
    if (pin) {
      return this.verifyPin(pin);
    }
    return false;
  }

  async verifyPin(pin: string): Promise<boolean> {
    const actualPin = await this.getValue('PORTAL_PIN', '2026'); // default pin is 2026
    return pin === actualPin;
  }

  async getCatalogos(): Promise<{ departamentos: string[]; categoriasActivos: string[] }> {
    const rawDeptos = await this.getValue('CATALOGO_DEPARTAMENTOS', '');
    const rawCategorias = await this.getValue('CATALOGO_CATEGORIAS_ACTIVOS', '');

    const defaultDeptos = ['Urgencias', 'Quirófano', 'Recursos Humanos', 'Administración', 'Farmacia', 'Consultorios', 'Admisión'];
    const defaultCategorias = ['Desktop / Laptop', 'Impresora', 'Bomba de Infusión', 'Monitor Vital', 'Router / Switch', 'PC', 'Monitor'];

    let departamentos = defaultDeptos;
    let categoriasActivos = defaultCategorias;

    if (rawDeptos) {
      try {
        departamentos = JSON.parse(rawDeptos);
      } catch (e) {
        departamentos = defaultDeptos;
      }
    }

    if (rawCategorias) {
      try {
        categoriasActivos = JSON.parse(rawCategorias);
      } catch (e) {
        categoriasActivos = defaultCategorias;
      }
    }

    return { departamentos, categoriasActivos };
  }

  async setCatalogo(tipo: 'departamentos' | 'categoriasActivos', items: string[], usuarioId?: string): Promise<string[]> {
    const clave = tipo === 'departamentos' ? 'CATALOGO_DEPARTAMENTOS' : 'CATALOGO_CATEGORIAS_ACTIVOS';
    await this.setValue(clave, JSON.stringify(items), usuarioId);
    return items;
  }
}
