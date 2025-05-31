import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { TokenService } from './token.service';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => ({
				secret: configService.getOrThrow<string>('JWT_SECRET'),
			}),
		}),
	],
	providers: [TokenService],
	exports: [TokenService],
})
export class TokenModule {}
