import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';
import { TokenService } from './token.service';
import { LoginData, RegisterData, TokenResponse } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = API_BASE_URL;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  login(data: LoginData): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login/`, data).pipe(
      tap((res: TokenResponse) => {
        this.tokenService.saveTokens(res);
      })
    );
  }

  logout(): Observable<any> {
    const refresh = this.tokenService.getRefreshToken();
    this.tokenService.clearTokens();
    return this.http.post(`${this.apiUrl}/logout/`, { refresh });
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasAccessToken();
  }
}
