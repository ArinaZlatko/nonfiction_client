import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/api.config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface ChapterImage {
  file: File | null;
  caption: string;
  order: number;
}

@Component({
  standalone: true,
  selector: 'app-add-chapter',
  templateUrl: './add-chapter.component.html',
  styleUrls: ['./add-chapter.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AddChapterComponent implements OnInit {
  bookId!: number;
  title = '';
  content = '';
  images: ChapterImage[] = [];

  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookId = +id;
    } else {
      this.errorMessage = 'ID книги не найден';
    }
  }

  addImageInput(): void {
    const order = this.images.length + 1;
    this.images.push({ file: null, caption: '', order });
  }

  onImageChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0] ? input.files[0] : null;
    this.images[index].file = file;
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('content', this.content);

    this.images.forEach((img) => {
      if (img.file) {
        formData.append('images', img.file, img.file.name);
        formData.append('captions', img.caption);
        formData.append('orders', img.order.toString());
      }
    });

    this.http
      .post(`${API_BASE_URL}/books/${this.bookId}/chapter/upload`, formData)
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
    this.title = '';
    this.content = '';
    this.images = [];
  }
}
