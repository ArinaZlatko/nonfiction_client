import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL, BASE_URL } from 'src/app/core/api.config';
import { CommonModule } from '@angular/common';
import { AddCommentComponent } from '../comments/add-comment/add-comment.component';

@Component({
  standalone: true,
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
  imports: [CommonModule, RouterModule, AddCommentComponent],
})
export class BookDetailComponent implements OnInit {
  book: any;
  bookId!: number;
  errorMessage: string | null = null;
  BaseUrl = BASE_URL;

  currentUser: string = '';
  userComment: any = null;
  otherComments: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Получение имени пользователя из токена (если есть)
    const token = localStorage.getItem('access_token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUser = payload.username;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookId = +id;
      this.loadBook(id);
      this.loadComments(id);
    }
  }

  loadBook(id: string) {
    this.http.get(API_BASE_URL + '/books/' + id + '/').subscribe({
      next: (data) => (this.book = data),
      error: () => (this.errorMessage = 'Ошибка загрузки книги'),
    });
  }

  loadComments(id: string) {
    this.http.get<any[]>(`${API_BASE_URL}/books/${id}/comments/`).subscribe({
      next: (data) => {
        const user = this.currentUser;
        this.userComment = data.find((c) => c.user === user) || null;
        this.otherComments = data
          .filter((c) => c.user !== user)
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
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
