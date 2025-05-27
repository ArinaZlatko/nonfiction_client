import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { API_BASE_URL } from '../../../core/api.config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chapter } from '../chapter.models';

@Component({
  selector: 'app-edit-chapter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-chapter.component.html',
})
export class EditChapterComponent implements OnInit {
  bookId!: number;
  chapterId!: number;
  chapter: Chapter = { title: '', content: '', images: [] };
  showImages = false;
  successMessage = '';
  errorMessage = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('bookId');
    const chapterId = this.route.snapshot.paramMap.get('chapterId');
    if (bookId && chapterId) {
      this.bookId = +bookId;
      this.chapterId = +chapterId;
      this.fetchChapter();
    } else {
      this.errorMessage = 'ID главы или книги не найден';
    }
  }

  fetchChapter(): void {
    this.http
      .get<Chapter>(
        `${API_BASE_URL}/books/${this.bookId}/chapter/${this.chapterId}/`
      )
      .subscribe({
        next: (data) => {
          this.chapter = {
            title: data.title,
            content: data.content,
            images: data.images || [],
          };
        },
        error: () => {
          this.errorMessage = 'Ошибка при загрузке главы';
        },
      });
  }

  moveImageUp(index: number): void {
    if (index > 0) {
      const current = { ...this.chapter.images[index] };
      const previous = { ...this.chapter.images[index - 1] };

      this.chapter.images[index - 1] = current;
      this.chapter.images[index] = previous;

      this.reassignImageOrder();
    }
  }

  moveImageDown(index: number): void {
    if (index < this.chapter.images.length - 1) {
      const current = { ...this.chapter.images[index] };
      const next = { ...this.chapter.images[index + 1] };

      this.chapter.images[index + 1] = current;
      this.chapter.images[index] = next;

      this.reassignImageOrder();
    }
  }

  reassignImageOrder(): void {
    this.chapter.images.forEach((img, index) => {
      img.order = index + 1;
    });
  }

  onSubmit(): void {
    const { title, content, images } = this.chapter;

    if (!title || !content) {
      this.errorMessage = 'Заполните все обязательные поля';
      return;
    }

    const payload = {
      title,
      content,
      images: images.map((img) => ({
        id: img.id,
        caption: img.caption,
        order: img.order,
      })),
    };

    this.http
      .patch<Chapter>(
        `${API_BASE_URL}/books/${this.bookId}/chapter/${this.chapterId}/edit/`,
        payload
      )
      .subscribe({
        next: (updated) => {
          this.chapter.title = updated.title;
          this.chapter.content = updated.content;
          this.chapter.images = updated.images || [];
          this.successMessage = 'Глава обновлена!';
          this.errorMessage = '';
        },
        error: () => {
          this.errorMessage = 'Ошибка при обновлении главы';
          this.successMessage = '';
        },
      });
  }
}
