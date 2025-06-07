import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { API_BASE_URL } from '../../core/api.config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  standalone: true,
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  imports: [CommonModule, FormsModule, NgSelectModule, RouterModule],
})
export class EditBookComponent implements OnInit {
  bookId!: number;
  title = '';
  description = '';
  coverFile: File | null = null;
  showCoverUpload = false;

  genres: any[] = [];
  selectedGenres: number[] = [];

  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));

    // Загрузка жанров
    this.http.get<any[]>(`${API_BASE_URL}/genres/`).subscribe({
      next: (data) => (this.genres = data),
      error: () => (this.errorMessage = 'Не удалось загрузить жанры'),
    });

    // Загрузка данных книги
    this.http.get<any>(`${API_BASE_URL}/books/${this.bookId}/`).subscribe({
      next: (data) => {
        this.title = data.title;
        this.description = data.description;
        this.selectedGenres = data.genres.map((g: any) => g.id);
      },
      error: () => {
        this.errorMessage = 'Не удалось загрузить данные книги';
      },
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

    if (!this.title || !this.description) {
      this.errorMessage = 'Название и описание обязательны';
      return;
    }

    if (this.selectedGenres.length === 0) {
      this.errorMessage = 'Пожалуйста, выберите хотя бы один жанр.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);

    if (this.coverFile) {
      formData.append('cover', this.coverFile, this.coverFile.name);
    }

    this.selectedGenres.forEach((id) => {
      formData.append('genre_ids', id.toString());
    });

    this.http
      .put<any>(`${API_BASE_URL}/books/${this.bookId}/edit/`, formData)
      .subscribe({
        next: () => {
          this.successMessage = 'Книга успешно обновлена';
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Ошибка при обновлении книги';
        },
      });
  }
}
