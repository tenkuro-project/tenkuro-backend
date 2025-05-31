import type { Role } from '@/prisma/generated';

export interface AuthTokenPayload {
	id: string;
	role: Role;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}
