import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { RegisterData } from '../auth.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
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
    role: null,
  };

  roles = [
    { label: 'Читатель', value: 'reader' },
    { label: 'Писатель', value: 'writer' },
  ];

  errorMessage: string = '';
  successMessage = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.register(this.form).subscribe({
      next: () => {
        this.successMessage = 'Регистрация прошла успешно!';
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
