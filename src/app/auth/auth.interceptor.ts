import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { TokenResponse } from './auth.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

  constructor(private tokenService: TokenService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.tokenService.getAccessToken();

    let authReq = req;
    if (accessToken) {
      authReq = this.addTokenHeader(req, accessToken);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/token/refresh')) {
          const refreshToken = this.tokenService.getRefreshToken();
          if (!refreshToken) {
            this.tokenService.clearTokens();
            this.router.navigate(['/login']);
            return throwError(() => error);
          }

          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.tokenService.refreshToken().pipe(
        switchMap((tokens: TokenResponse) => {
          this.isRefreshing = false;
          this.tokenService.saveTokens(tokens);
          this.refreshTokenSubject.next(tokens.access);
          return next.handle(this.addTokenHeader(req, tokens.access));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.tokenService.clearTokens();
          this.router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addTokenHeader(req, token!)))
      );
    }
  }

  private addTokenHeader(
    req: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
