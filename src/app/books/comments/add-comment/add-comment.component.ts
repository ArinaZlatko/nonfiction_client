import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { API_BASE_URL } from 'src/app/core/api.config';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  standalone: true,
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
})
export class AddCommentComponent {
  @Input() bookId!: number;

  content = '';
  ratingOptions = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
  ];

  rating: number | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.content || !this.rating) {
      this.errorMessage =
        'Необходимо заполнить текст комментария и поставить оценку.';
      return;
    }

    const payload = {
      content: this.content,
      rating: this.rating,
      book: this.bookId, // 👈 важно!
    };

    this.http
      .post(`${API_BASE_URL}/books/${this.bookId}/comment/upload/`, payload)
      .subscribe({
        next: () => {
          this.successMessage = 'Комментарий успешно добавлен!';
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage =
            err.error?.detail || 'Ошибка при добавлении комментария.';
        },
      });
  }

  resetForm(): void {
    this.content = '';
    this.rating = null;
  }
}
