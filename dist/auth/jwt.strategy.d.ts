import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usuariosRepository;
    constructor(usuariosRepository: Repository<Usuario>);
    validate(payload: any): Promise<Usuario>;
}
export {};
