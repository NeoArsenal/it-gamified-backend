import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity.js';
import { TicketsService } from './tickets.service.js';
import { TicketsController } from './tickets.controller.js';
import { TicketRateLimitGuard } from './guards/ticket-rate-limit.guard.js';

import { StorageModule } from '../storage/storage.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), StorageModule],
  controllers: [TicketsController],
  providers: [TicketsService, TicketRateLimitGuard],
  exports: [TicketsService],
})
export class TicketsModule {}
