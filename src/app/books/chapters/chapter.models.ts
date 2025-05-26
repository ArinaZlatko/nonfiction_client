export interface ChapterImage {
  id?: number;
  file: File | null;
  caption: string;
  order: number;
  url?: string;
}

export interface Chapter {
  id?: number;
  title: string;
  content: string;
  images: ChapterImage[];
}
