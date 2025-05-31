import { Module } from '@nestjs/common';

import { HashModule } from '@/libs/hash/hash.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [HashModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
