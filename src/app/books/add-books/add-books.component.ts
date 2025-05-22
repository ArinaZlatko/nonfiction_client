import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/api.config';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-books.component.html'
})
export class AddBooksComponent {
  title: string = '';
  description: string = '';
  coverFile!: File;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.coverFile = file;
    }
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('cover', this.coverFile, this.coverFile.name);

    this.http.post<any>(`${API_BASE_URL}/books/upload/`, formData).subscribe({
      next: (response) => {
        this.successMessage = `Книга успешно загружена с ID ${response.book_id}`;
        this.title = '';
        this.description = '';
        this.coverFile = undefined!;
      },
      error: (err) => {
        if (err.error && err.error.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = 'Ошибка при загрузке книги';
        }
      }
    });
  }
}

