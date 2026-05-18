import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useDashboardPosts } from "@/hooks/use-dashboard-posts";
import type { DashboardPost, DashboardSection } from "@/types/DashboardPost";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Calendar,
  Trash2,
  Bell,
  CalendarClock,
  NotebookPen,
  MonitorDot,
} from "lucide-react";
import CreateDashboardPostDialog from "./CreateDashboardPostDialog";
import DeleteDashboardPostDialog from "./DeleteDashboardPostDialog";

const SECTION_ICONS: Record<DashboardSection, React.ReactNode> = {
  reminders: <Bell className="size-4 text-primary" />,
  "team-meeting": <CalendarClock className="size-4 text-primary" />,
  "quote-of-the-week": <NotebookPen className="size-4 text-primary" />,
  "staff-updates": <MonitorDot className="size-4 text-primary" />,
};

interface Props {
  section: DashboardSection;
  label: string;
}

export default function DashboardSectionCard({ section, label }: Props) {
  const { user } = useContext(AuthContext);
  const dashboardState = useDashboardPosts(section);
  const { posts, loading } = dashboardState;
  const [expanded, setExpanded] = useState<number | null>(null);

  const isAdmin = user?.role === "admin" || user?.role === "super-admin";

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="border rounded-xl p-4 min-h-[220px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {SECTION_ICONS[section]}
          <h2 className="text-base font-semibold">{label}</h2>
        </div>
        {isAdmin && (
          <CreateDashboardPostDialog
            section={section}
            sectionLabel={label}
            dashboardState={dashboardState}
            imageUpload={section !== "quote-of-the-week"}
          >
            <Button size="sm" variant="outline">
              <Plus className="size-3.5" />
              
            </Button>
          </CreateDashboardPostDialog>
        )}
      </div>

      {/* Body */}
      {loading && posts.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
          Loading...
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
          No posts yet
        </div>
      )}

      {posts.length > 0 && (
        <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
          {posts.map((post: DashboardPost) => (
            <div
              key={post.id}
              className="group rounded-lg border border-border/50 bg-card hover:bg-muted/40 hover:border-primary/20 transition-all duration-150 cursor-pointer overflow-hidden"
              onClick={() => setExpanded(expanded === post.id ? null : post.id)}
            >
              <div className="flex items-start gap-3 p-3">
                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold line-clamp-1 leading-snug">
                    {post.title}
                  </p>
                  <p
                    className={`text-xs text-muted-foreground leading-relaxed mt-1 ${
                      expanded === post.id ? "" : "line-clamp-2"
                    }`}
                  >
                    {post.content}
                  </p>

                  {expanded === post.id && (
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5 shrink-0">
                          <AvatarFallback className="text-[10px] font-medium bg-primary/10 text-primary">
                            {post.authorName
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{post.authorName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar size={10} />
                        <span className="text-[11px]">{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image thumbnail */}
                {post.image && (
                  <div className="shrink-0 w-12 h-12 rounded-md overflow-hidden bg-muted">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Delete — admin only, shown on hover */}
                {isAdmin && (
                  <DeleteDashboardPostDialog post={post} dashboardState={dashboardState}>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </DeleteDashboardPostDialog>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
