import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { LoginData } from '../auth.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../token.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  form: LoginData = {
    username: '',
    password: '',
  };

  errorMessage: string = '';

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.form).subscribe({
      next: () => {
        this.authService.updateAuthState();
  
        const role = this.tokenService.getRole();
  
        if (role === 'writer') {
          this.router.navigateByUrl('/books/mybooks');
        } else {
          this.router.navigateByUrl('/books');
        }
      },
      error: (err) => {
        this.errorMessage = 'Неверные данные для входа';
        console.error(err);
      },
    });
  }
}
