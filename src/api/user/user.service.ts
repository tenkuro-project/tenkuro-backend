import { Injectable, NotFoundException } from '@nestjs/common';

import type { Prisma, User } from '@/prisma/generated';

import { PrismaService } from '@/infra/prisma/prisma.service';

import { HashService } from '@/libs/hash/hash.service';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly hashService: HashService,
	) {}

	async create(dto: CreateUserDto): Promise<User> {
		const hashedPassword = await this.hashService.hash(dto.password);

		const user: Prisma.UserCreateInput = {
			email: dto.email,
			password: hashedPassword,
		};

		return this.prismaService.user.create({
			data: user,
		});
	}

	async findByEmail(email: string): Promise<User> {
		return this.prismaService.user.findUnique({
			where: {
				email,
			},
		});
	}

	async findById(id: string): Promise<User> {
		const user = await this.prismaService.user.findUnique({
			where: {
				id,
			},
		});

		if (!user) throw new NotFoundException('User not found!');

		return user;
	}
}
