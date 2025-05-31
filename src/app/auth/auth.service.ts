import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { of, tap, Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';
import { TokenService } from './token.service';
import { RegisterData, TokenResponse } from './auth.model';
import { AuthStateService } from './auth-state.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = API_BASE_URL;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private authState: AuthStateService
  ) {}

  register(data: RegisterData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/register/`,
      data
    );
  }

  login(credentials: any): Observable<void> {
    return this.http
      .post<TokenResponse>(`${API_BASE_URL}/login/`, credentials)
      .pipe(
        tap((tokens) => {
          this.tokenService.saveTokens(tokens);
          this.authState.updateRoleFromToken();
        }),
        map(() => {})
      );
  }

  logout(): Observable<void> {
    return of(null).pipe(
      tap(() => {
        this.tokenService.clearTokens();
        this.authState.clearRole();
      }),
      map(() => {})
    );
  }

  isAuthenticated(): boolean {
    const token = this.tokenService.getAccessToken();
    return !!token && !this.tokenService.isTokenExpired(token);
  }

  updateAuthState(): void {
    this.authState.updateRoleFromToken();
  }
}
