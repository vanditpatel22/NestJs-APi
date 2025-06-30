import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'NtiWNtkrHZDybsDgXwO7WSHdnnyhS1dB'
        });
    }

    async validate(payload: any) {
        return { user_id: payload.user_id, email: payload.email }
    }

}
