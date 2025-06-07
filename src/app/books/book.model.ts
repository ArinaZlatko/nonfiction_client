export interface Book {
  id: number;
  title: string;
  description: string;
  created_at: Date;
  author: string;
  cover?: string;
  genres: { name: string }[];
  chapters: { id: number; title: string }[];
  is_owner: boolean;
}
