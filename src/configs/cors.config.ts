import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

export const getCorsConfig = (configService: ConfigService): CorsOptions => {
	const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS', '');
	const origin = allowedOrigins ? allowedOrigins.split(',').map((origin) => origin.trim()) : [];

	return {
		origin,
		credentials: true,
	};
};
