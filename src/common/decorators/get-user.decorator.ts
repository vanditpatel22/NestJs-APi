import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { logger } from '../../logger/winston.logger';
export const GetUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        if (!request.user) {
            
            throw new UnauthorizedException('User not authenticated');
        }
        return request.user; // This is the payload returned from JwtStrategy.validate()
    },
);
