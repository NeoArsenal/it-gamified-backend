import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async setValue(clave: string, valor: string): Promise<Configuracion> {
    let config = await this.configRepo.findOne({ where: { clave } });
    if (!config) {
      config = this.configRepo.create({ clave, valor });
    } else {
      config.valor = valor;
    }
    return this.configRepo.save(config);
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

  async setCatalogo(tipo: 'departamentos' | 'categoriasActivos', items: string[]): Promise<string[]> {
    const clave = tipo === 'departamentos' ? 'CATALOGO_DEPARTAMENTOS' : 'CATALOGO_CATEGORIAS_ACTIVOS';
    await this.setValue(clave, JSON.stringify(items));
    return items;
  }
}
