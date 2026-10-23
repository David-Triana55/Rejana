import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { LoginService } from '../../../../application/services/login/login.service.js';
import { LogoutService } from '../../../../application/services/logout/logout.service.js';
import { RefreshTokenService } from '../../../../application/services/refresh-token/refresh-token.service.js';
import { LoginDto } from '../../../../application/dto/login.dto.js';

const ACCESS_COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const REFRESH_COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const REFRESH_COOKIE_PATH = '/api/auth';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly logoutService: LogoutService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ name: string | null; role: string }> {
    const { accessToken, refreshToken, name, role } =
      await this.loginService.execute(dto);

    this.setAuthCookies(res, accessToken, refreshToken);

    return { name, role };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) {
      throw new UnauthorizedException({
        code: 'REFRESH_TOKEN_MISSING',
        message: 'No autenticado',
      });
    }

    const { accessToken, refreshToken } =
      await this.refreshTokenService.execute(token);

    this.setAuthCookies(res, accessToken, refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.logoutService.execute(req.cookies?.refreshToken as string | undefined);
    res.clearCookie('token', this.cookieOptions('/'));
    res.clearCookie('refreshToken', this.cookieOptions(REFRESH_COOKIE_PATH));
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    res.cookie('token', accessToken, {
      ...this.cookieOptions('/'),
      maxAge: ACCESS_COOKIE_MAX_AGE_MS,
    });
    res.cookie('refreshToken', refreshToken, {
      ...this.cookieOptions(REFRESH_COOKIE_PATH),
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    });
  }

  private cookieOptions(path: string) {
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path,
    };
  }
}
