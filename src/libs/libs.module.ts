import { Module } from '@nestjs/common';

import { HashModule } from './hash/hash.module';
import { TokenModule } from './token/token.module';

@Module({
	imports: [HashModule, TokenModule],
})
export class LibsModule {}
