import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL, BASE_URL } from 'src/app/core/api.config';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
  imports: [CommonModule, RouterModule],
})
export class BookDetailComponent implements OnInit {
  book: any;
  bookId!: number;
  errorMessage: string | null = null;
  BaseUrl = BASE_URL;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookId = +id;
      this.http.get(API_BASE_URL + '/books/' + id + '/').subscribe({
        next: (data) => (this.book = data),
        error: () => (this.errorMessage = 'Ошибка загрузки книги'),
      });
    }
  }
}
