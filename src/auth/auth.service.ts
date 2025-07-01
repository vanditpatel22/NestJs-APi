import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) { }


    async register(email: string, password: string) {

        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('text_user_already_exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userService.create(email, hashedPassword);
        return user;
    }

    async login(email: string, password: string) {

        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('text_invalid_email');
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            throw new UnauthorizedException("text_invalid_password")
        }

        const payload = { user_id: user._id, email: user.email }
        const token = this.jwtService.sign(payload);

        const userDetails = {
            ...user, access_token: token
        }

        return userDetails

    }
}
