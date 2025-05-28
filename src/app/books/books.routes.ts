import { Routes } from '@angular/router';
import { AddBookComponent } from './add-book/add-book.component';
import { GetBooksComponent } from './get-books/get-books.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { EditBookComponent } from './edit-book/edit-book.component';
import { DeleteBookComponent } from './delete-book/delete-book.component';
import { BooksMineComponent } from './books-mine/books-mine.component';

export const BOOKS_ROUTES: Routes = [
  { path: 'add', component: AddBookComponent },
  { path: 'get', component: GetBooksComponent },
  { path: 'mybooks', component: BooksMineComponent },
  {
    path: ':bookId/chapters',
    loadChildren: () =>
      import('./chapters/chapters.routes').then((m) => m.CHAPTERS_ROUTES),
  },
  { path: ':id/edit', component: EditBookComponent },
  { path: ':id/delete', component: DeleteBookComponent },
  { path: ':id', component: BookDetailComponent },
];
