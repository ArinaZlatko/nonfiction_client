import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { API_BASE_URL } from 'src/app/core/api.config';

@Component({
  selector: 'app-delete-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-book.component.html',
  styleUrl: './delete-book.component.css',
})
export class DeleteBookComponent implements OnInit {
  bookId!: number;
  errorMessage = '';
  isDeleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookId = +id;
    } else {
      this.errorMessage = 'Неверный путь. Книга не найдена.';
    }
  }

  confirmDelete(): void {
    this.isDeleting = true;
    this.http.delete(`${API_BASE_URL}/books/${this.bookId}/delete/`).subscribe({
      next: () => {
        this.router.navigate(['/books/get']);
      },
      error: (err) => {
        this.errorMessage = err.error?.detail || 'Ошибка при удалении книги.';
        this.isDeleting = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/books', this.bookId]);
  }
}
