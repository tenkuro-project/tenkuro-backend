import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';

@Injectable()
export class HashService {
	async hash(plainText: string): Promise<string> {
		return hash(plainText);
	}

	async compare(hashedText: string, plainText: string): Promise<boolean> {
		return verify(hashedText, plainText);
	}
}
