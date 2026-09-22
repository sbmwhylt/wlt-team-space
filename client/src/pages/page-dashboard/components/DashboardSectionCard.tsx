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
  Inbox,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CreateDashboardPostDialog from "./CreateDashboardPostDialog";
import DeleteDashboardPostDialog from "./DeleteDashboardPostDialog";
import DashboardCard, {
  DashboardCardEmpty,
  DashboardCardSkeleton,
} from "./DashboardCard";

const SECTION_ICONS: Record<DashboardSection, LucideIcon> = {
  reminders: Bell,
  "team-meeting": CalendarClock,
  "quote-of-the-week": NotebookPen,
  "staff-updates": MonitorDot,
};

const PREVIEW_COUNT = 3;

const getInitials = (name?: string) =>
  name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

interface Props {
  section: DashboardSection;
  label: string;
  compact?: boolean;
}

export default function DashboardSectionCard({
  section,
  label,
  compact,
}: Props) {
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

  return (
    <DashboardCard
      icon={SECTION_ICONS[section]}
      title={label}
      count={posts.length}
      actions={
        <>
          {posts.length > 1 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-muted-foreground"
              onClick={() => setShowAll(true)}
            >
              View all
            </Button>
          )}
          {isAdmin && (
            <CreateDashboardPostDialog
              section={section}
              sectionLabel={label}
              dashboardState={dashboardState}
              imageUpload={true}
            >
              <Button
                size="icon-sm"
                variant="ghost"
                title={`Add to ${label}`}
                className="text-muted-foreground hover:text-foreground"
              >
                <Plus className="size-4" />
              </Button>
            </CreateDashboardPostDialog>
          )}
        </>
      }
    >
      {loading && posts.length === 0 && <DashboardCardSkeleton rows={2} />}

      {!loading && posts.length === 0 && (
        <DashboardCardEmpty
          icon={Inbox}
          message="Nothing posted yet"
          hint={isAdmin ? "Use + to add the first post." : undefined}
        />
      )}

      {latest && (
        <div className="flex flex-1 flex-col gap-2">
          {/* Most recent post — prominent */}
          <div
            role="button"
            tabIndex={0}
            className="group shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-card text-left transition-colors hover:border-primary/30 hover:bg-muted/40"
            onClick={() => setSelectedId(latest.id)}
            onKeyDown={(e) => e.key === "Enter" && setSelectedId(latest.id)}
          >
            {latest.image && (
              <div
                className={`w-full overflow-hidden bg-muted ${compact ? "h-36" : "h-64"}`}
              >
                <img
                  src={latest.image}
                  alt={latest.title}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
            )}
            <div className="flex items-start gap-2 p-3">
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-semibold leading-snug">
                  {latest.title}
                </p>
                <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {latest.content}
                </p>
                <PostMeta
                  authorName={latest.authorName}
                  createdAt={latest.createdAt}
                />
              </div>

              {/* Delete — admin only, shown on hover */}
              {isAdmin && (
                <DeleteDashboardPostDialog
                  post={latest}
                  dashboardState={dashboardState}
                >
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
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
            <div className="flex shrink-0 flex-col gap-0.5 border-t pt-2">
              {preview.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted"
                  onClick={() => setSelectedId(post.id)}
                >
                  <span className="truncate text-xs font-medium">
                    {post.title}
                  </span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
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
        <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>
              All {posts.length} {posts.length === 1 ? "post" : "posts"} in this
              section.
            </DialogDescription>
          </DialogHeader>

          <div className="-mx-1 flex flex-col gap-1.5 overflow-y-auto px-1">
            {posts.map((post: DashboardPost) => (
              <div
                key={post.id}
                role="button"
                tabIndex={0}
                className="group shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary/30 hover:bg-muted/40"
                onClick={() => {
                  setShowAll(false);
                  setSelectedId(post.id);
                }}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  setShowAll(false);
                  setSelectedId(post.id);
                }}
              >
                <div className="flex items-start gap-3 p-3">
                  {post.image && (
                    <div className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="size-full object-cover"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold leading-snug">
                      {post.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {post.content}
                    </p>
                    <PostMeta
                      authorName={post.authorName}
                      createdAt={post.createdAt}
                    />
                  </div>

                  {isAdmin && (
                    <DeleteDashboardPostDialog
                      post={post}
                      dashboardState={dashboardState}
                    >
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
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
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              Posted by {selected?.authorName}
              {selected ? ` on ${formatDate(selected.createdAt)}` : ""}
            </DialogDescription>
          </DialogHeader>

          {selected?.image && (
            <div className="overflow-hidden rounded-lg bg-muted">
              <img
                src={selected.image}
                alt={selected.title}
                className="max-h-72 w-full object-cover"
              />
            </div>
          )}

          <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {selected?.content}
          </p>

          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-2">
              <Avatar className="size-6 shrink-0">
                <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
                  {getInitials(selected?.authorName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">
                {selected?.authorName}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar size={12} />
              <span className="text-xs">
                {selected ? formatDate(selected.createdAt) : ""}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardCard>
  );
}

function PostMeta({
  authorName,
  createdAt,
}: {
  authorName?: string;
  createdAt: string;
}) {
  return (
    <div className="mt-2 flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-1.5">
        <Avatar className="size-5 shrink-0">
          <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
            {getInitials(authorName)}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-xs font-medium">{authorName}</span>
      </div>
      <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
        <Calendar size={10} />
        <span className="text-[11px]">{formatDate(createdAt)}</span>
      </div>
    </div>
  );
}
