import { Module } from '@nestjs/common';

import { HashModule } from '@/libs/hash/hash.module';
import { TokenModule } from '@/libs/token/token.module';

import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	imports: [UserModule, HashModule, TokenModule],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
