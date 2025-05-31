import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private roleSubject = new BehaviorSubject<string | null>(null);
  role$ = this.roleSubject.asObservable();

  constructor(private tokenService: TokenService) {
    this.updateRoleFromToken();
  }

  updateRoleFromToken(): void {
    const role = this.tokenService.getRole();
    this.roleSubject.next(role);
  }

  getRole(): string | null {
    return this.roleSubject.value;
  }

  isRole(role: string): boolean {
    return this.roleSubject.value === role;
  }

  clearRole(): void {
    this.roleSubject.next(null);
  }
}
