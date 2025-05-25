import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/api.config';
import { Observable } from 'rxjs';

export interface ChapterDetail {
  id: number;
  title: string;
  content: string;
  order: number;
  images: {
    image: string;
    caption: string;
    order: number;
  }[];
}

@Injectable({ providedIn: 'root' })
export class ChapterService {
  constructor(private http: HttpClient) {}

  getChapterDetail(bookId: number, chapterId: number): Observable<ChapterDetail> {
    return this.http.get<ChapterDetail>(
      `${API_BASE_URL}/books/${bookId}/chapter/${chapterId}/`
    );
  }
}
