import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chapter } from '../chapter.models';


@Component({
  standalone: true,
  selector: 'app-chapter-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './chapter-form.component.html',
})
export class ChapterFormComponent {
  @Input() title = '';
  @Input() content = '';
  @Input() images: Chapter['images'] = [];

  @Output() titleChange = new EventEmitter<string>();
  @Output() contentChange = new EventEmitter<string>();
  @Output() imagesChange = new EventEmitter<Chapter['images']>();
  @Output() submitForm = new EventEmitter<void>();

  addImageInput(): void {
    const newImages = [...this.images, { file: null, caption: '', order: this.images.length + 1 }];
    this.imagesChange.emit(newImages);
  }

  onImageChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    const newImages = [...this.images];
    newImages[index].file = file;
    this.imagesChange.emit(newImages);
  }
}
