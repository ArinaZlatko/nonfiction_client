import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { API_BASE_URL, BASE_URL } from '../../../core/api.config';
import { ChapterFormComponent } from '../chapter-form/chapter-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chapter } from '../chapter.models';

@Component({
  selector: 'app-edit-chapter',
  standalone: true,
  imports: [CommonModule, FormsModule, ChapterFormComponent, RouterLink],
  templateUrl: './edit-chapter.component.html',
})
export class EditChapterComponent implements OnInit {
  bookId!: number;
  chapterId!: number;

  chapter: Chapter = {
    title: '',
    content: '',
    images: [],
  };

  errorMessage = '';
  successMessage = '';
  deletedImageIds: number[] = [];

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
      .get<any>(
        `${API_BASE_URL}/books/${this.bookId}/chapter/${this.chapterId}/`
      )
      .subscribe({
        next: (data) => {
          this.chapter.title = data.title;
          this.chapter.content = data.content;
          this.chapter.images = data.images.map((img: any, index: number) => ({
            id: img.id,
            file: null,
            caption: img.caption,
            order: img.order || index + 1,
            url: BASE_URL + img.image,
          }));
        },
        error: () => {
          this.errorMessage = 'Ошибка при загрузке главы';
        },
      });
  }

  onSubmit(): void {
    const { title, content, images } = this.chapter;

    if (!title || !content) {
      this.errorMessage = 'Заполните все обязательные поля';
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
      } else if (img.id) {
        formData.append('existing_image_ids', img.id.toString());
        formData.append('existing_captions', img.caption);
        formData.append('existing_orders', img.order.toString());
      }
    });

    this.deletedImageIds.forEach((id) => {
      formData.append('deleted_image_ids', id.toString());
    });

    this.http
      .put(
        `${API_BASE_URL}/books/${this.bookId}/chapter/${this.chapterId}/edit/`,
        formData
      )
      .subscribe({
        next: () => {
          this.successMessage = 'Глава обновлена!';
        },
        error: () => {
          this.errorMessage = 'Ошибка при обновлении главы';
        },
      });
  }

  onDeleteImage(index: number): void {
    const image = this.chapter.images[index];
    if (image.id) {
      this.deletedImageIds.push(image.id);
    }
    this.chapter.images.splice(index, 1);
  }
}
