export interface SongPick {
  id: number;
  title: string;
  artist: string | null;
  url: string | null;
  thumbnail: string | null;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}
