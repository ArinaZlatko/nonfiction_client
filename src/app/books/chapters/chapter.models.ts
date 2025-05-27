export interface ChapterImage {
  id?: number;
  image?: string;
  file?: File | null;
  caption: string;
  order: number;
}

export interface Chapter {
  id?: number;
  title: string;
  content: string;
  images: ChapterImage[];
}
