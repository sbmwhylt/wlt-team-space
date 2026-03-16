export interface NoticePost {
  id: number;
  title: string;
  content: string;
  image: string | null;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}
