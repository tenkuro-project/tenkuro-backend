import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { getCorsConfig } from './configs/cors.config';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
	const logger = new Logger(AppModule.name);
	const configService = app.get(ConfigService);

	const globalPrefix = 'api/v1';
	app.setGlobalPrefix(globalPrefix);

	app.enableCors(getCorsConfig(configService));

	const port = configService.get<number>('PORT', 4000);
	const url = `http://localhost:${port}/${globalPrefix}`;

	try {
		await app.listen(port);

		logger.log(`🚀 Server is running at: ${url}`);
	} catch (error) {
		logger.error(`❌ Failed to start server: ${error.message}`, error);
		process.exit(1);
	}
}
bootstrap();
