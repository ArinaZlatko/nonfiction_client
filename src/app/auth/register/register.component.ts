import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { RegisterData } from '../auth.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  form: RegisterData = {
    username: '',
    password: '',
    password2: '',
    email: '',
    first_name: '',
    last_name: '',
    surname: '',
    role: ''
  };

  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.register(this.form).subscribe({
      next: () => alert('Регистрация успешна'),
      error: err => {
        this.errorMessage = 'Ошибка регистрации';
        console.error(err);
      }
    });
  }
}
