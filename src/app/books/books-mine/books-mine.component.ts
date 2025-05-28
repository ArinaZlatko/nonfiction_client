import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { API_BASE_URL, BASE_URL } from 'src/app/core/api.config';

@Component({
  selector: 'app-book-mine',
  imports: [CommonModule, RouterModule],
  templateUrl: './books-mine.component.html',
})
export class BooksMineComponent {
  books: any[] = [];
  errorMessage = '';
  BaseUrl = BASE_URL;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${API_BASE_URL}/mybooks/`).subscribe({
      next: (data) => (this.books = data),
      error: () => (this.errorMessage = 'Не удалось загрузить книги.'),
    });
  }
}
