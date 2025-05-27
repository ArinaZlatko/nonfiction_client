import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { API_BASE_URL } from '../../../core/api.config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chapter } from '../chapter.models';

@Component({
  standalone: true,
  selector: 'app-add-chapter',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-chapter.component.html',
})
export class AddChapterComponent implements OnInit {
  bookId!: number;
  chapter: Chapter = { title: '', content: '', images: [] };
  editingFlags: boolean[] = [];
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('bookId');
    if (id) this.bookId = +id;
    else this.errorMessage = 'ID книги не найден';
  }

  addImage(): void {
    this.chapter.images.push({
      file: null,
      caption: '',
      order: this.chapter.images.length + 1,
    });
    this.editingFlags.push(true);
  }

  onImageChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (file) {
      this.chapter.images[index].file = file;
      this.chapter.images[index].image = URL.createObjectURL(file);
    }
  }

  updateOrders(): void {
    this.chapter.images.forEach((img, i) => (img.order = i + 1));
  }

  onDeleteImage(index: number): void {
    this.chapter.images.splice(index, 1);
    this.editingFlags.splice(index, 1);
    this.chapter.images.forEach((img, i) => (img.order = i + 1));
  }

  toggleEditing(index: number): void {
    this.editingFlags[index] = !this.editingFlags[index];
  }

  onSubmit(): void {
    const { title, content, images } = this.chapter;

    if (!title || !content) {
      this.errorMessage = 'Заполните название и содержание главы.';
      return;
    }

    images.forEach((img, index) => {
      img.order = index + 1;
    });

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    images.forEach((img) => {
      if (img.file) {
        formData.append('images', img.file, img.file.name); // <-- исправлено
        formData.append('captions', img.caption); // <-- исправлено
        formData.append('orders', img.order.toString()); // <-- исправлено
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
    this.chapter = { title: '', content: '', images: [] };
    this.editingFlags = [];
  }
}
