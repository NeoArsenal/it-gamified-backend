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
}
