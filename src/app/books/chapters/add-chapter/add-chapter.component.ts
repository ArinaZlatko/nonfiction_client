import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { API_BASE_URL } from '../../../core/api.config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChapterFormComponent } from '../chapter-form/chapter-form.component';
import { Chapter } from '../chapter.models';

@Component({
  standalone: true,
  selector: 'app-add-chapter',
  templateUrl: './add-chapter.component.html',
  imports: [CommonModule, FormsModule, ChapterFormComponent],
})
export class AddChapterComponent implements OnInit {
  bookId!: number;

  chapter: Chapter = {
    title: '',
    content: '',
    images: [],
  };

  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('bookId');
    if (id) this.bookId = +id;
    else this.errorMessage = 'ID книги не найден';
  }

  onSubmit(): void {
    const { title, content, images } = this.chapter;

    if (!title || !content) {
      this.errorMessage = 'Заполните название и содержание главы.';
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    images.forEach((img) => {
      if (img.file) {
        formData.append('images', img.file, img.file.name);
        formData.append('captions', img.caption);
        formData.append('orders', img.order.toString());
      }
    });

    this.http
      .post(`${API_BASE_URL}/books/${this.bookId}/chapter/upload/`, formData)
      .subscribe({
        next: () => {
          this.successMessage = 'Глава успешно добавлена!';
          this.resetForm();
        },
        error: () => {
          this.errorMessage = 'Ошибка при добавлении главы';
        },
      });
  }

  resetForm(): void {
    this.chapter = {
      title: '',
      content: '',
      images: [],
    };
  }
}
