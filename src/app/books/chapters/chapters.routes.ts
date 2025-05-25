import { Routes } from '@angular/router';
import { AddChapterComponent } from './add-chapter/add-chapter.component';
import { ChapterDetailComponent } from './chapter-detail/chapter-detail.component';

export const CHAPTERS_ROUTES: Routes = [
  { path: 'add', component: AddChapterComponent },
  { path: ':chapterId', component: ChapterDetailComponent },
];
