import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/api.config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  imports: [CommonModule, FormsModule, NgSelectModule, RouterModule],
})
export class AddBookComponent implements OnInit {
  title = '';
  description = '';
  coverFile!: File;

  genres: any[] = [];
  selectedGenres: number[] = [];

  bookId: string | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${API_BASE_URL}/genres/`).subscribe({
      next: (data) => (this.genres = data),
      error: () => (this.errorMessage = 'Не удалось загрузить жанры'),
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.coverFile = file;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.title || !this.description || !this.coverFile) {
      this.errorMessage = 'Все поля обязательны';
      return;
    }

    if (this.selectedGenres.length === 0) {
      this.errorMessage = 'Пожалуйста, выберите хотя бы один жанр.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('cover', this.coverFile, this.coverFile.name);

    this.selectedGenres.forEach((id) =>
      formData.append('genre_ids', id.toString())
    );

    this.http.post<any>(`${API_BASE_URL}/books/upload/`, formData).subscribe({
      next: (response) => {
        this.bookId = response.book_id;
        this.successMessage = 'Книга успешно загружена!';
        this.resetForm();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Ошибка при загрузке книги';
      },
    });
  }

  resetForm(): void {
    this.title = '';
    this.description = '';
    this.coverFile = undefined!;
    this.selectedGenres = [];
    const input = document.getElementById('cover') as HTMLInputElement;
    if (input) input.value = '';
  }
}
