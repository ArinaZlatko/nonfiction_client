import { Routes } from '@angular/router';
import { AddBookComponent } from './add-book/add-book.component';
import { GetBooksComponent } from './get-books/get-books.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { EditBookComponent } from './edit-book/edit-book.component';
import { DeleteBookComponent } from './delete-book/delete-book.component';
import { BooksMineComponent } from './books-mine/books-mine.component';
import { RoleGuard } from '../auth/role.guard';

export const BOOKS_ROUTES: Routes = [
  { path: '', component: GetBooksComponent },
  {
    path: 'add',
    component: AddBookComponent,
    canActivate: [RoleGuard],
    data: { role: 'writer' },
  },
  {
    path: 'mybooks',
    component: BooksMineComponent,
    canActivate: [RoleGuard],
    data: { role: 'writer' },
  },
  {
    path: 'detail/:bookId/chapters',
    loadChildren: () =>
      import('./chapters/chapters.routes').then((m) => m.CHAPTERS_ROUTES),
  },
  {
    path: 'detail/:id/edit',
    component: EditBookComponent,
    canActivate: [RoleGuard],
    data: { role: 'writer' },
  },
  {
    path: 'detail/:id/delete',
    component: DeleteBookComponent,
    canActivate: [RoleGuard],
    data: { role: 'writer' },
  },
  { path: 'detail/:id', component: BookDetailComponent },
];
