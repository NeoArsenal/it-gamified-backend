import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class NotificacionesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificacionesGateway');

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers['authorization']?.split(' ')[1];
      if (!token) throw new Error('No token provided');
      const payload = this.jwtService.verify(token);
      client.join('authenticated');
      this.logger.log(`Client connected: ${client.id} - User ID: ${payload.sub}`);
    } catch (error) {
      this.logger.warn(`Desconectando cliente no autorizado: ${client.id} - Razón: ${error.message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Métodos que otros servicios pueden llamar para emitir eventos
  emitirNuevoTicket(ticket: any) {
    this.server.emit('nuevoTicket', ticket);
  }

  emitirTicketActualizado(ticket: any) {
    this.server.emit('ticketActualizado', ticket);
  }

  emitirTicketEliminado(id: string) {
    this.server.emit('ticketEliminado', id);
  }
}
