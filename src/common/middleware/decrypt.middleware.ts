import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { decrypt } from '../utils/crypto.util';
import { SETTINGS } from '../constants/settings.constant';

@Injectable()
export class DecryptMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (!SETTINGS.ENABLE_ENCRYPTION) return next();

        if (req.body && typeof req.body === 'string') {
            try {
                req.body = decrypt(req.body);
            } catch (err) {
                console.error('Decryption failed:', err.message);
            }
        }
        next();
    }
}
