import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    standalone: false
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: err => {
        console.error('Ошибка при выходе', err);
        this.router.navigate(['/auth/login']);
      }
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}
