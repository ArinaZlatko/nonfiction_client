import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddBooksComponent } from './add-books/add-books.component';
import { BooksRoutingModule } from './books-routing.module';

@NgModule({
  declarations: [AddBooksComponent],
  imports: [
    CommonModule,
    FormsModule,
    BooksRoutingModule
  ]
})
export class BooksModule {}
