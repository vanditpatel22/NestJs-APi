import { Injectable, UnauthorizedException } from '@nestjs/common';
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

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userService.create(email, hashedPassword)
        return { message: 'User Created', data: user }

    }

    async login(email: string, password: string) {

        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid Email');
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            throw new UnauthorizedException("Invalid Password")
        }

        const payload = { user_id: user._id, email: user.email }
        const token = this.jwtService.sign(payload);

        const userDetails = {
            ...user, access_token: token
        }

        return { message: 'User Login successfully', data: userDetails }

    }
}
