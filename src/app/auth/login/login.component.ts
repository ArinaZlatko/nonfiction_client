import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { LoginData } from '../auth.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    standalone: false
})
export class LoginComponent {
  form: LoginData = {
    username: '',
    password: ''
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
      }
    });
  }
}
