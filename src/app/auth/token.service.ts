import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../core/api.config';
import { TokenResponse } from './auth.model';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private refreshTimeout: any;

  constructor(private http: HttpClient) {}

  saveTokens(res: TokenResponse) {
    localStorage.setItem('access_token', res.access);
    localStorage.setItem('refresh_token', res.refresh);
    this.scheduleRefresh(res.access);
  }

  clearTokens() {
    if (this.refreshTimeout) clearTimeout(this.refreshTimeout);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  hasAccessToken(): boolean {
    return !!this.getAccessToken();
  }

  refreshToken(): Observable<TokenResponse> {
    const refresh = this.getRefreshToken();
    if (!refresh) {
      this.clearTokens();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http
      .post<TokenResponse>(`${API_BASE_URL}/token/refresh/`, { refresh })
      .pipe(
        switchMap((res) => {
          this.saveTokens(res);
          return [res];
        }),
        catchError((err) => {
          this.clearTokens();
          return throwError(() => err);
        })
      );
  }

  scheduleRefresh(accessToken: string) {
    if (this.refreshTimeout) clearTimeout(this.refreshTimeout);

    const jwtPayload = this.decodeJwt(accessToken);
    const exp = jwtPayload?.exp;
    if (!exp) return;

    const expiresInMs = exp * 1000 - Date.now() - 6000;
    if (expiresInMs <= 0) return;

    this.refreshTimeout = setTimeout(() => {
      this.refreshToken().subscribe({
        next: () => {},
        error: () => {
          this.clearTokens();
        },
      });
    }, expiresInMs);
  }

  private decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }
}
