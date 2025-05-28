import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL, BASE_URL } from 'src/app/core/api.config';
import { CommonModule } from '@angular/common';
import { AddCommentComponent } from '../comments/add-comment/add-comment.component';
import { Book } from '../book.model';

@Component({
  standalone: true,
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
  imports: [CommonModule, RouterModule, AddCommentComponent],
})
export class BookDetailComponent implements OnInit {
  book!: Book;
  bookId!: number;
  isOwner: boolean = false;
  errorMessage: string | null = null;
  BaseUrl = BASE_URL;

  comments: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookId = +id;
      this.loadBook(id);
      this.loadComments(id);
    }
  }

  loadBook(id: string) {
    this.http.get<Book>(API_BASE_URL + '/books/' + id + '/').subscribe({
      next: (data) => {
        this.book = data;
        this.isOwner = data.is_owner;
      },
      error: () => (this.errorMessage = 'Ошибка загрузки книги'),
    });
  }

  loadComments(id: string) {
    this.http.get<any[]>(`${API_BASE_URL}/books/${id}/comments/`).subscribe({
      next: (data) => {
        this.comments = data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      },
      error: () => (this.errorMessage = 'Ошибка загрузки комментариев'),
    });
  }

  onCommentAdded() {
    if (this.bookId) {
      this.loadComments(this.bookId.toString());
    }
  }
}
