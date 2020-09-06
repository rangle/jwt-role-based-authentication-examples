import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Set refreshToken to cookie and remove refreshToken from payload */
@Injectable()
export class CookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        const res = context.switchToHttp().getResponse();
        const { accessToken, refreshToken } = data;

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days - express accepts token maxAge in ms, therefore multiply by 1000
          path: '/api/auth/refresh-token', // attach the refreshToken only to this endpoint
        });

        return { accessToken };
      }),
    );
  }
}
