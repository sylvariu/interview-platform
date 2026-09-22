import { createParamDecorator, type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import type { Request } from 'express';

export const Authorized = createParamDecorator(
    (data: keyof User | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest() as Request;

        const user = request.user as User | undefined;
        if (!user) {
            throw new UnauthorizedException('Invalid token');
        }

        // если в скобках @Authorized() указано, что именно нужно возвращать, то это и возвращаем
        // иначе возвращаем всего пользователя
        return data ? user[data] : user;
    },
);