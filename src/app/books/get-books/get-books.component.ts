import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { API_BASE_URL, BASE_URL } from '../../core/api.config';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  standalone: true,
  selector: 'app-get-books',
  imports: [CommonModule, FormsModule, RouterModule, NgSelectModule],
  templateUrl: './get-books.component.html',
  styleUrl: './get-books.component.css',
})
export class GetBooksComponent implements OnInit {
  books: any[] = [];
  genres: any[] = [];
  authors: any[] = [];
  average_rating: number | null = null;
  errorMessage = '';
  BaseUrl = BASE_URL;

  selectedAuthor: string | null = null;
  selectedGenres: string[] = [];
  searchTerm: string = '';

  sortField: 'rating' | 'date' | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  sortFields = [
    { value: 'rating', label: 'Рейтингу' },
    { value: 'date', label: 'Дате' },
  ];

  sortDirections = [
    { value: 'desc', label: 'По убыванию' },
    { value: 'asc', label: 'По возрастанию' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchBooks();
    this.fetchGenres();
    this.fetchAuthors();
  }

  fetchBooks(): void {
    let params = new HttpParams();

    if (this.selectedGenres && this.selectedGenres.length > 0) {
      this.selectedGenres.forEach((genreId) => {
        params = params.append('genre', genreId);
      });
    }

    if (this.selectedAuthor) {
      params = params.set('author', this.selectedAuthor);
    }

    if (this.searchTerm) {
      params = params.set('search', this.searchTerm);
    }

    if (this.sortField) {
      params = params.set('sort_field', this.sortField);
      params = params.set('sort_direction', this.sortDirection);
    }

    this.http.get<any[]>(`${API_BASE_URL}/books/`, { params }).subscribe({
      next: (data) => {
        this.books = data;
        this.errorMessage = '';
      },
      error: () => (this.errorMessage = 'Не удалось загрузить книги.'),
    });
  }

  fetchGenres(): void {
    this.http.get<any[]>(`${API_BASE_URL}/genres/`).subscribe({
      next: (data) => (this.genres = data),
      error: () => (this.genres = []),
    });
  }

  fetchAuthors(): void {
    this.http.get<any[]>(`${API_BASE_URL}/writers/`).subscribe({
      next: (data) => {
        this.authors = data
          .filter((author) => author.id !== null && author.id !== undefined)
          .map((author) => ({
            ...author,
            fullName: `${author.first_name ?? ''} ${author.last_name ?? ''} ${
              author.surname ?? ''
            }`.trim(),
          }));
      },
      error: () => (this.authors = []),
    });
  }

  applyFilters(): void {
    this.fetchBooks();
  }

  resetFilters(): void {
    this.selectedGenres = [];
    this.selectedAuthor = null;
    this.searchTerm = '';
    this.sortField = null;
    this.sortDirection = 'asc';
    this.fetchBooks();
  }

  onSortFieldChange(field: 'rating' | 'date' | null): void {
    this.sortField = field;
    this.fetchBooks();
  }

  onSortDirectionChange(direction: 'asc' | 'desc'): void {
    this.sortDirection = direction;
    this.fetchBooks();
  }

  getRatingClasses(rating: number): string[] {
    if (rating >= 4) {
      return ['bg-green-100', 'text-green-800'];
    } else if (rating >= 3) {
      return ['bg-orange-100', 'text-orange-800'];
    } else {
      return ['bg-red-100', 'text-red-800'];
    }
  }
}
