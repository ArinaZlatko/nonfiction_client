import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChapterService } from '../chapter.service';
import { switchMap, map } from 'rxjs';

@Component({
  selector: 'app-chapter-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chapter-detail.component.html',
  styleUrls: ['./chapter-detail.component.css'],
})
export class ChapterDetailComponent {
  private route = inject(ActivatedRoute);
  private chapterService = inject(ChapterService);

  bookId = Number(this.route.snapshot.paramMap.get('bookId'));

  isOwner = signal(false);

  chapter$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const bookId = +params.get('bookId')!;
      const chapterId = +params.get('chapterId')!;
      return this.chapterService.getChapterDetail(bookId, chapterId);
    }),
    map((chapter) => {
      const hasImgs = (chapter.images?.length ?? 0) > 0;
      this.hasImages.set(hasImgs);
      this.showImages.set(hasImgs);

      this.isOwner.set(chapter.is_owner);

      return {
        ...chapter,
        content: chapter.content?.replace(/\n/g, '<br>') ?? '',
      };
    })
  );

  // Отображение текста и изображений
  showText = signal(true);
  showImages = signal(true);

  // Флаг наличия изображений
  hasImages = signal(false);

  // Вычисление ширины текста и изображений
  textWidth = computed(() => {
    return this.showText() && !this.showImages()
      ? 1
      : this.showText() && this.showImages()
      ? this._textWidth()
      : 0;
  });

  imagesWidth = computed(() => {
    return this.showImages() && !this.showText()
      ? 1
      : this.showText() && this.showImages()
      ? 1 - this._textWidth()
      : 0;
  });

  // Внутренний сигнал ширины текста
  private _textWidth = signal(0.5);

  // Обработчик перетаскивания границы
  onDrag(event: MouseEvent) {
    event.preventDefault();
    const container = document.querySelector('.chapter-layout')!;
    const startX = event.clientX;
    const startTextWidth = this._textWidth();
    const containerWidth = container.clientWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newTextWidth = startTextWidth + deltaX / containerWidth;
      if (newTextWidth < 0.1) newTextWidth = 0.1;
      if (newTextWidth > 0.9) newTextWidth = 0.9;
      this._textWidth.set(newTextWidth);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  // Вычисление доступной высоты экрана
  calcAvailableHeight() {
    const headerHeight = 64;
    const footerHeight = 56;
    return `calc(100vh - ${headerHeight + footerHeight}px)`;
  }
}
