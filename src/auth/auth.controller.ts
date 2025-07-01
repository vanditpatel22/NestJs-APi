import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ResponseUtil } from 'src/common/utils/response.util';
import { logger } from 'src/logger/winston.logger';
import { STATUS, RESPONSE_CODE } from 'src/common/constants/response-codes.constant';
import { handleControllerError } from 'src/common/helpers/error.helper';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly responseUtil: ResponseUtil,
    ) { }

    @Post('register')
    async register(
        @Req() req: Request,
        @Res() res: Response,
        @Body() body: { email: string; password: string },
    ) {
        try {
            const userDetails = await this.authService.register(
                body.email,
                body.password,
            );

            if (userDetails) {
                return this.responseUtil.sendResponse(
                    req,
                    res,
                    STATUS.OK,
                    RESPONSE_CODE.SUCCESS,
                    { keyword: 'text_user_register_succ', components: {} },
                    userDetails,
                );
            } else {
                return this.responseUtil.sendResponse(
                    req,
                    res,
                    STATUS.NON_AUTHORITATIVE_INFORMATION,
                    RESPONSE_CODE.FAIL,
                    { keyword: 'text_user_register_fail', components: {} },
                    null,
                );
            }
        } catch (error) {
            return handleControllerError(req, res, error, this.responseUtil);
        }
    }

    @Post('login')
    async login(
        @Req() req: Request,
        @Res() res: Response,
        @Body() body: { email: string; password: string },
    ) {

        try {

            const loginDetails = await this.authService.login(body.email, body.password);

            if (loginDetails != null) {

                return this.responseUtil.sendResponse(
                    req,
                    res,
                    STATUS.OK,
                    RESPONSE_CODE.SUCCESS,
                    { keyword: 'text_user_login_succ', components: {} },
                    loginDetails,
                );

            } else {

                return this.responseUtil.sendResponse(
                    req,
                    res,
                    STATUS.NON_AUTHORITATIVE_INFORMATION,
                    RESPONSE_CODE.FAIL,
                    { keyword: 'text_user_login_fail', components: {} },
                    null,
                );

            }

        } catch (error) {
            return handleControllerError(req, res, error, this.responseUtil);
        }


    }
}
