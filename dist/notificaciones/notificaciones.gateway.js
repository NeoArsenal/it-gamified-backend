var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
let NotificacionesGateway = class NotificacionesGateway {
    jwtService;
    server;
    logger = new Logger('NotificacionesGateway');
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        try {
            let token = client.handshake.auth?.token
                || client.handshake.headers['authorization']?.split(' ')[1]
                || client.handshake.query?.token;
            if (typeof token === 'string' && token.startsWith('Bearer ')) {
                token = token.slice(7);
            }
            if (token) {
                const payload = this.jwtService.verify(token);
                client.join('authenticated');
                this.logger.log(`Cliente autenticado conectado: ${client.id} - Usuario: ${payload.sub || payload.email}`);
            }
            else {
                this.logger.log(`Cliente conectado (sin token o público): ${client.id}`);
            }
        }
        catch (error) {
            this.logger.warn(`Conexión de cliente ${client.id} advertencia de token: ${error.message}`);
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    emitirNuevoTicket(ticket) {
        this.server.emit('nuevoTicket', ticket);
    }
    emitirTicketActualizado(ticket) {
        this.server.emit('ticketActualizado', ticket);
    }
    emitirTicketEliminado(id) {
        this.server.emit('ticketEliminado', id);
    }
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Server)
], NotificacionesGateway.prototype, "server", void 0);
NotificacionesGateway = __decorate([
    Injectable(),
    WebSocketGateway({
        cors: {
            origin: (origin, callback) => {
                callback(null, true);
            },
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    }),
    __metadata("design:paramtypes", [JwtService])
], NotificacionesGateway);
export { NotificacionesGateway };
//# sourceMappingURL=notificaciones.gateway.js.map