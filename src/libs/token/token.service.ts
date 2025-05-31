import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

@Injectable()
export class TokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async sign<T extends object>(payload: T, options?: JwtSignOptions): Promise<string> {
		return this.jwtService.signAsync(payload, options);
	}

	async verify<T extends object>(token: string, options?: JwtVerifyOptions): Promise<T> {
		return this.jwtService.verifyAsync<T>(token, options);
	}

	async issueTokenPair<T extends object>(payload: T) {
		const accessExpiresIn = this.configService.getOrThrow<string>('ACCESS_TOKEN_EXPIRATION');
		const refreshExpiresIn = this.configService.getOrThrow<string>('REFRESH_TOKEN_EXPIRATION');

		const [accessToken, refreshToken] = await Promise.all([
			this.sign(payload, { expiresIn: accessExpiresIn }),
			this.sign(payload, { expiresIn: refreshExpiresIn }),
		]);

		return { accessToken, refreshToken };
	}
}
