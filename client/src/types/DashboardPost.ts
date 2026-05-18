export type DashboardSection =
  | "reminders"
  | "team-meeting"
  | "quote-of-the-week"
  | "staff-updates";

export interface DashboardPost {
  id: number;
  section: DashboardSection;
  title: string;
  content: string;
  image: string | null;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}
