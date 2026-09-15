import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class LoginThrottlerGuard implements CanActivate {
    private readonly logger;
    private readonly attempts;
    private readonly WINDOW_MS;
    private readonly MAX_ATTEMPTS;
    private readonly BLOCK_DURATION_MS;
    canActivate(context: ExecutionContext): boolean;
    private getClientIp;
}
