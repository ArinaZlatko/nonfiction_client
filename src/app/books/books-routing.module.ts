import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBooksComponent } from './add-books/add-books.component';
import { GetBooksComponent } from './get-books/get-books.component';
import { BookDetailComponent } from './book-detail/book-detail.component';

const routes: Routes = [
  { path: 'add', component: AddBooksComponent },
  { path: 'get', component: GetBooksComponent },
  { path: ':id', component: BookDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule {}
