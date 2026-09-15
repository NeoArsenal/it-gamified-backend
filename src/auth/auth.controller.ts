import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request, Req } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { LoginThrottlerGuard } from './guards/login-throttler.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LoginThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto, @Req() req: any) {
    const forwarded = req.headers?.['x-forwarded-for'];
    const clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : (req.ip || req.socket?.remoteAddress || 'unknown');
    return this.authService.login(loginDto, clientIp);
  }

  // Ruta para obtener perfil actual usando token
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}

