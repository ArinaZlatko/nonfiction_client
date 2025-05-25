import { Routes } from '@angular/router';
import { AddBookComponent } from './add-book/add-book.component';
import { GetBooksComponent } from './get-books/get-books.component';
import { BookDetailComponent } from './book-detail/book-detail.component';

export const BOOKS_ROUTES: Routes = [
  { path: 'add', component: AddBookComponent },
  { path: 'get', component: GetBooksComponent },
  {
    path: ':bookId/chapters',
    loadChildren: () =>
      import('./chapters/chapters.routes').then((m) => m.CHAPTERS_ROUTES),
  },
  { path: ':id', component: BookDetailComponent },
];
