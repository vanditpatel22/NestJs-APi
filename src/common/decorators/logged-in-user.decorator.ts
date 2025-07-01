// src/common/decorators/logged-in-user.decorator.ts

import { createParamDecorator, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';

export const LoggedInUser = createParamDecorator(
    async (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const userId = request.user?.user_id || request.user?.userId;
        if (!userId) {
            throw new UnauthorizedException('User ID not found in request');
        }

        // Get ModuleRef from request container
        const moduleRef: ModuleRef = request.app.get(ModuleRef);

        // Resolve UsersService dynamically
        const usersService = await moduleRef.resolve(UsersService, undefined, { strict: false });

        // Fetch user from DB
        const user = await usersService.findById(userId);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }
);
