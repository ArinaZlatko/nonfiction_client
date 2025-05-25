import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { API_BASE_URL } from '../../core/api.config';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-get-books',
  imports: [CommonModule, RouterModule],
  templateUrl: './get-books.component.html',
  styleUrl: './get-books.component.css',
})
export class GetBooksComponent implements OnInit {
  books: any[] = [];
  errorMessage = '';
  BaseUrl = API_BASE_URL.slice(0, -4);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${API_BASE_URL}/books/`).subscribe({
      next: (data) => (this.books = data),
      error: () => (this.errorMessage = 'Не удалось загрузить книги.'),
    });
  }
}
