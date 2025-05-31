import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@/prisma/generated';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(PrismaService.name);

	async onModuleInit(): Promise<void> {
		this.logger.log('🔄 Initializing database connection...');

		try {
			await this.$connect();
			this.logger.log('✅ Database connection established successfully.');
		} catch (error) {
			this.logger.error('❌ Failed to establish database connection.', error);
			throw error;
		}
	}

	async onModuleDestroy(): Promise<void> {
		this.logger.log('🔻 Closing database connection...');

		try {
			await this.$disconnect();
			this.logger.log('🟢 Database connection closed successfully.');
		} catch (error) {
			this.logger.error('⚠️ Error occurred while closing the database connection.', error);
			throw error;
		}
	}
}
