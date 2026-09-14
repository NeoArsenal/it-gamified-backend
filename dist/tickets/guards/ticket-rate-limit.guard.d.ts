import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class TicketRateLimitGuard implements CanActivate {
    private readonly logger;
    private readonly ipRequests;
    private readonly MAX_REQUESTS;
    private readonly WINDOW_MS;
    constructor();
    canActivate(context: ExecutionContext): boolean;
    private cleanup;
}
