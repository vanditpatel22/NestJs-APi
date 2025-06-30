import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private configServices: ConfigService) {
        const jwtSecret = configServices.get<string>('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: any) {
        return { userId: payload.user_id, email: payload.email }
    }

}
