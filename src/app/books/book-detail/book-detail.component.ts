import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from 'src/app/core/api.config';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
  imports: [CommonModule],
})
export class BookDetailComponent implements OnInit {
  book: any;
  errorMessage: string | null = null;
  BaseUrl = API_BASE_URL.slice(0, -4);

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get(API_BASE_URL + '/books/' + id + '/').subscribe({
        next: (data) => (this.book = data),
        error: () => (this.errorMessage = 'Ошибка загрузки книги'),
      });
    }
  }
}
