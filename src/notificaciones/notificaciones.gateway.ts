import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      // Permitir cualquier origen (Vercel en producción, localhost en desarrollo, etc.)
      callback(null, true);
    },
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class NotificacionesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificacionesGateway');

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      let token = client.handshake.auth?.token 
        || client.handshake.headers['authorization']?.split(' ')[1]
        || (client.handshake.query?.token as string);

      if (typeof token === 'string' && token.startsWith('Bearer ')) {
        token = token.slice(7);
      }

      if (token) {
        const payload = this.jwtService.verify(token);
        client.join('authenticated');
        this.logger.log(`Cliente autenticado conectado: ${client.id} - Usuario: ${payload.sub || payload.email}`);
      } else {
        this.logger.log(`Cliente conectado (sin token o público): ${client.id}`);
      }
    } catch (error) {
      this.logger.warn(`Conexión de cliente ${client.id} advertencia de token: ${error.message}`);
      // Permitir que el cliente permanezca conectado para recibir eventos públicos
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
