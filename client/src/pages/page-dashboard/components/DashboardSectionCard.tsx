import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useDashboardPosts } from "@/hooks/use-dashboard-posts";
import type { DashboardPost, DashboardSection } from "@/types/DashboardPost";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

const PREVIEW_COUNT = 3;

const getInitials = (name?: string) =>
  name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

interface Props {
  section: DashboardSection;
  label: string;
  compact?: boolean;
}

export default function DashboardSectionCard({ section, label, compact }: Props) {
  const { user } = useContext(AuthContext);
  const dashboardState = useDashboardPosts(section);
  const { posts, loading } = dashboardState;
  const isAdmin = user?.role === "admin" || user?.role === "super-admin";
  // Track the id, not the post itself, so a deleted post closes the dialog
  // instead of leaving a stale copy on screen.
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const selected = posts.find((p) => p.id === selectedId) ?? null;

  const latest = posts[0];
  const preview = posts.slice(1, 1 + PREVIEW_COUNT);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className={`border rounded-xl p-4 flex flex-col ${compact ? "h-full min-h-0 overflow-hidden" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {SECTION_ICONS[section]}
          <h2 className="text-base font-semibold">{label}</h2>
        </div>
        <div className="flex items-center gap-1">
          {posts.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-muted-foreground"
              onClick={() => setShowAll(true)}
            >
              View More
            </Button>
          )}
          {isAdmin && (
            <CreateDashboardPostDialog
              section={section}
              sectionLabel={label}
              dashboardState={dashboardState}
              imageUpload={true}
            >
              <Button size="sm" variant="outline" className="border-none shadow-none">
                <Plus className="size-3.5" />
              </Button>
            </CreateDashboardPostDialog>
          )}
        </div>
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

      {latest && (
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          {/* Most recent post — prominent */}
          <div
            className="group rounded-lg border border-border/50 bg-card overflow-hidden shrink-0 cursor-pointer hover:bg-muted/40 hover:border-primary/20 transition-all duration-150"
            onClick={() => setSelectedId(latest.id)}
          >
            {latest.image && (
              <div className={`w-full bg-muted overflow-hidden ${compact ? "h-44" : "h-72"}`}>
                <img
                  src={latest.image}
                  alt={latest.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-start gap-3 p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold line-clamp-1 leading-snug">
                  {latest.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-3">
                  {latest.content}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-5 shrink-0">
                      <AvatarFallback className="text-[10px] font-medium bg-primary/10 text-primary">
                        {getInitials(latest.authorName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{latest.authorName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar size={10} />
                    <span className="text-[11px]">{formatDate(latest.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Delete — admin only, shown on hover */}
              {isAdmin && (
                <DeleteDashboardPostDialog post={latest} dashboardState={dashboardState}>
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

          {/* Preview of the next few items */}
          {preview.length > 0 && (
            <div className="flex flex-col gap-0.5 mt-2 shrink-0">
              {preview.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left cursor-pointer hover:bg-muted/40 transition-colors"
                  onClick={() => setSelectedId(post.id)}
                >
                  <span className="text-xs font-medium truncate">{post.title}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {formatDate(post.createdAt)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full list dialog */}
      <Dialog open={showAll} onOpenChange={setShowAll}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>
              All {posts.length} {posts.length === 1 ? "post" : "posts"} in this section.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5 overflow-y-auto">
            {posts.map((post: DashboardPost) => (
              <div
                key={post.id}
                className="group rounded-lg border border-border/50 bg-card overflow-hidden shrink-0 cursor-pointer hover:bg-muted/40 hover:border-primary/20 transition-all duration-150"
                onClick={() => {
                  setShowAll(false);
                  setSelectedId(post.id);
                }}
              >
                <div className="flex items-start gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold line-clamp-1 leading-snug">
                      {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5 shrink-0">
                          <AvatarFallback className="text-[10px] font-medium bg-primary/10 text-primary">
                            {getInitials(post.authorName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{post.authorName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar size={10} />
                        <span className="text-[11px]">{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {post.image && (
                    <div className="shrink-0 w-12 h-12 rounded-md overflow-hidden bg-muted">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

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
        </DialogContent>
      </Dialog>

      {/* Post detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              Posted by {selected?.authorName}
              {selected ? ` on ${formatDate(selected.createdAt)}` : ""}
            </DialogDescription>
          </DialogHeader>

          {selected?.image && (
            <div className="rounded-lg overflow-hidden bg-muted max-h-64">
              <img
                src={selected.image}
                alt={selected.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {selected?.content}
          </p>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="size-6 shrink-0">
                <AvatarFallback className="text-[10px] font-medium bg-primary/10 text-primary">
                  {getInitials(selected?.authorName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">{selected?.authorName}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar size={12} />
              <span className="text-xs">{selected ? formatDate(selected.createdAt) : ""}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
