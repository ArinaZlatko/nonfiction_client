import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { LoginData } from '../auth.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  form: LoginData = {
    username: '',
    password: '',
  };

  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.login(this.form).subscribe({
      next: (res) => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        alert('Успешный вход!');
      },
      error: (err) => {
        this.errorMessage = 'Неверные данные для входа';
        console.error(err);
      },
    });
  }
}
