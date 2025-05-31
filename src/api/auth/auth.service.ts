import { BadRequestException, Injectable } from '@nestjs/common';

import type { User } from '@/prisma/generated';

import { HashService } from '@/libs/hash/hash.service';
import { TokenService } from '@/libs/token/token.service';

import { UserService } from '../user/user.service';

import type { AuthTokenPayload, AuthTokens } from './auth.types';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly hashService: HashService,
		private readonly tokenService: TokenService,
	) {}

	async register(dto: AuthDto): Promise<AuthTokens> {
		const isExists = await this.userService.findByEmail(dto.email);
		if (isExists) throw new BadRequestException('Email busy!');

		const user = await this.userService.create(dto);

		return this.tokenService.issueTokenPair<AuthTokenPayload>({
			id: user.id,
			role: user.role,
		});
	}

	async login(dto: AuthDto): Promise<AuthTokens> {
		const user = await this.validateUser(dto);

		return this.tokenService.issueTokenPair<AuthTokenPayload>({
			id: user.id,
			role: user.role,
		});
	}

	async refresh(refreshToken: string): Promise<AuthTokens> {
		const payload = await this.tokenService.verify<AuthTokenPayload>(refreshToken);
		const user = await this.userService.findById(payload.id);

		return this.tokenService.issueTokenPair<AuthTokenPayload>({
			id: user.id,
			role: user.role,
		});
	}

	private async validateUser(dto: AuthDto): Promise<User> {
		const user = await this.userService.findByEmail(dto.email);
		const isValidPassword = !user
			? false
			: await this.hashService.compare(user.password, dto.password);

		if (!user || !isValidPassword) throw new BadRequestException('Email or password is invalid');

		return user;
	}
}
