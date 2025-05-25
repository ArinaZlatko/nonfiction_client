import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChapterService } from '../chapter.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-chapter-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chapter-detail.component.html',
  styleUrl: './chapter-detail.component.css',
})
export class ChapterDetailComponent {
  private route = inject(ActivatedRoute);
  private chapterService = inject(ChapterService);

  chapter$ = this.route.paramMap.pipe(
    // получить bookId и chapterId из URL
    switchMap((params) => {
      const bookId = params.get('bookId')!;
      const chapterId = params.get('chapterId')!;
      return this.chapterService.getChapterDetail(+bookId, +chapterId);
    })
  );
}
