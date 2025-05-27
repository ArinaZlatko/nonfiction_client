import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/api.config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-chapter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-chapter.component.html',
  styleUrl: './delete-chapter.component.css',
})
export class DeleteChapterComponent implements OnInit {
  bookId!: number;
  chapterId!: number;
  errorMessage = '';
  isDeleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('bookId');
    const chapterId = this.route.snapshot.paramMap.get('chapterId');

    if (bookId && chapterId) {
      this.bookId = +bookId;
      this.chapterId = +chapterId;
    } else {
      this.errorMessage = 'Неверный путь. Глава не найдена.';
    }
  }

  confirmDelete(): void {
    this.isDeleting = true;
    this.http
      .delete(`${API_BASE_URL}/books/${this.bookId}/chapter/${this.chapterId}/delete/`)
      .subscribe({
        next: () => {
          this.router.navigate(['/books', this.bookId]);
        },
        error: () => {
          this.errorMessage = 'Ошибка при удалении главы.';
          this.isDeleting = false;
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/books', this.bookId, 'chapters', this.chapterId, 'edit']);
  }
}
