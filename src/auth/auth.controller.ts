import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private AuthService: AuthService
    ) { }

    @Post('register')
    register(@Body() body: { email: string; password: string }) {
        return this.AuthService.register(body.email, body.password)
    }

    @Post('login')
    login(@Body() body: { email: string; password: string }) {
        return this.AuthService.login(body.email, body.password)
    }

}
