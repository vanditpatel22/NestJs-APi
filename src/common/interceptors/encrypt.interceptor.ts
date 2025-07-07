import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { encrypt } from '../utils/crypto.util';
import { SETTINGS } from '../constants/settings.constant';

@Injectable()
export class EncryptInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => {
                if (!SETTINGS.ENABLE_ENCRYPTION) {
                    return data;
                }
                return encrypt(data);
            }),
        );
    }
}
