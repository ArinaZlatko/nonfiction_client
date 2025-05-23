import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { RegisterData } from '../auth.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: false,
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
    role: '',
  };

  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.register(this.form).subscribe({
      next: () => {
        alert('Регистрация успешна');
        this.errorMessage = '';
      },
      error: (err) => {
        const errors = err.error;

        if (errors?.email?.includes('This field must be unique.')) {
          this.errorMessage =
            'Эта почта уже используется. Пожалуйста, укажите другую.';
        } else if (errors?.password) {
          this.errorMessage = 'Ошибка с паролем: ' + errors.password.join(', ');
        } else if (typeof errors === 'object') {
          // Общий случай — собрать и показать все ошибки
          const messages = Object.entries(errors)
            .map(
              ([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`
            )
            .join(' | ');
          this.errorMessage = `Ошибка регистрации: ${messages}`;
        } else {
          this.errorMessage = 'Ошибка регистрации. Попробуйте снова.';
        }

        console.error(err);
      },
    });
  }
}
