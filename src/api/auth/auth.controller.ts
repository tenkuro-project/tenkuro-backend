import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Request, Response } from 'express';

import { isProd } from '@/common/utils/env.utils';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Res({ passthrough: true }) res: Response, @Body() dto: AuthDto) {
		return this.handleAuth(res, dto, 'register');
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Res({ passthrough: true }) res: Response, @Body() dto: AuthDto) {
		return this.handleAuth(res, dto, 'login');
	}

	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refresh(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
		const refreshTokenFromCookie = req.cookies['refreshToken'];
		if (!refreshTokenFromCookie) throw new UnauthorizedException('Refresh token not be provided');

		const { accessToken, refreshToken } = await this.authService.refresh(refreshTokenFromCookie);

		this.sendRefreshTokenToCookie(res, refreshToken);

		return { accessToken };
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(@Res({ passthrough: true }) res: Response) {
		this.removeRefreshTokenFromCookie(res);
		return { success: true };
	}

	private async handleAuth(res: Response, dto: AuthDto, method: 'login' | 'register') {
		const { accessToken, refreshToken } = await this.authService[method](dto);

		this.sendRefreshTokenToCookie(res, refreshToken);

		return { accessToken };
	}

	private sendRefreshTokenToCookie(res: Response, refreshToken: string) {
		const refreshExpiresIn = this.configService.getOrThrow<string>('REFRESH_TOKEN_EXPIRATION');
		const expiresDate = parseInt(refreshExpiresIn, 10);

		const expiresIn = new Date();
		expiresIn.setDate(expiresIn.getDate() + expiresDate);

		const cookieOptions = this.getCookieOptions(expiresIn);

		res.cookie('refreshToken', refreshToken, cookieOptions);
	}

	private removeRefreshTokenFromCookie(res: Response) {
		const expiresIn = new Date(0);
		const cookieOptions = this.getCookieOptions(expiresIn);

		res.cookie('refreshToken', '', cookieOptions);
	}

	private getCookieOptions(expires: Date): CookieOptions {
		const domain = this.configService.get<string>('DOMAIN', 'localhost');

		return {
			httpOnly: true,
			sameSite: isProd ? 'lax' : 'none',
			secure: isProd,
			path: '/',
			domain,
			expires,
		};
	}
}
