import { Request, Response } from 'express';
import { I18nService } from '../../i18n/i18n.service';
import { Injectable } from '@nestjs/common';
import { logger } from '../../logger/winston.logger';

export interface ResponseMessage {
    keyword: string;
    components?: Record<string, string | number>;
}

@Injectable()
export class ResponseUtil {
    constructor(private readonly i18n: I18nService) { }

    getMessage(keyword: string, lang: string, components?: Record<string, any>): string {
        try {
            return this.i18n.t(keyword, lang, components);
        } catch (err) {
            logger.error(err);
            return keyword;
        }
    }

    sendResponse(
        req: Request,
        res: Response,
        statusCode: number,
        responseCode: number | string,
        responseMessage: ResponseMessage,
        responseData: any = null,
        extra?: Record<string, any>
    ): void {
        try {
            const lang = this.i18n.detectLanguage(req);

            const formedMsg = this.getMessage(
                responseMessage.keyword,
                lang,
                responseMessage.components
            );

            const resultObj: any = {
                code: responseCode,
                message: formedMsg,
            };

            if (responseData !== null) resultObj.data = responseData;
            if (extra && typeof extra === 'object') Object.assign(resultObj, extra);

            res.status(statusCode).json(resultObj);
        } catch (error) {
            logger.error(error);
            res.status(statusCode).json({
                code: responseCode,
                message: 'An internal error occurred',
            });
        }
    }
}
