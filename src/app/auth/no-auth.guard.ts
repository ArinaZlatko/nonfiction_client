import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const isLoggedIn = !!this.tokenService.getAccessToken();
    if (isLoggedIn) {
      return this.router.createUrlTree(['/books']);
    }
    return true;
  }
}
