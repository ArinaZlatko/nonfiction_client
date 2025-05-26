import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chapter, ChapterImage } from '../chapter.models';

@Component({
  standalone: true,
  selector: 'app-chapter-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './chapter-form.component.html',
})
export class ChapterFormComponent {
  editingFlags: boolean[] = [];

  @Input() title = '';
  @Input() content = '';
  @Input() set images(value: Chapter['images']) {
    this._images = value;
    this.editingFlags = new Array(value.length).fill(false);
  }
  get images(): Chapter['images'] {
    return this._images;
  }
  private _images: Chapter['images'] = [];

  @Output() titleChange = new EventEmitter<string>();
  @Output() contentChange = new EventEmitter<string>();
  @Output() imagesChange = new EventEmitter<Chapter['images']>();
  @Output() submitForm = new EventEmitter<void>();
  @Output() deleteImage = new EventEmitter<number>();

  addImageInput(): void {
    const newImages = [
      ...this.images,
      { file: null, caption: '', order: this.images.length + 1 },
    ];
    this.imagesChange.emit(newImages);
  }

  onImageChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    const newImages = [...this.images];
    newImages[index] = {
      ...newImages[index],
      file,
    };
    this.imagesChange.emit(newImages);
  }

  onDeleteImage(index: number): void {
    this.deleteImage.emit(index);
  }

  toggleEditing(index: number): void {
    this.editingFlags[index] = !this.editingFlags[index];
  }
}
