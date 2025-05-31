import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { AuthStateService } from 'src/app/auth/auth-state.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent implements OnInit {
  role: string | null = null;

  constructor(
    public authService: AuthService,
    private router: Router,
    private authState: AuthStateService
  ) {}

  ngOnInit() {
    this.authState.role$.subscribe((role) => {
      this.role = role;
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get isWriter(): boolean {
    return this.role === 'writer';
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Ошибка при выходе', err);
        this.router.navigate(['/auth/login']);
      },
    });
  }
}
