import { Routes } from '@angular/router';
import { AddChapterComponent } from './add-chapter/add-chapter.component';
import { ChapterDetailComponent } from './chapter-detail/chapter-detail.component';
import { EditChapterComponent } from './edit-chapter/edit-chapter.component';
import { DeleteChapterComponent } from './delete-chapter/delete-chapter.component';
import { RoleGuard } from 'src/app/auth/role.guard';

export const CHAPTERS_ROUTES: Routes = [
  {
    path: 'add',
    component: AddChapterComponent,
    canActivate: [RoleGuard],
    data: { role: 'writer' },
  },
  {
    path: 'detail/:chapterId/delete',
    component: DeleteChapterComponent,
    canActivate: [RoleGuard],
    data: { role: 'writer' },
  },
  {
    path: 'detail/:chapterId/edit',
    component: EditChapterComponent,
    canActivate: [RoleGuard],
    data: { role: 'writer' },
  },
  { path: 'detail/:chapterId', component: ChapterDetailComponent },
];
