import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import EditPostDialog from "../forms/EditPostDialog";
import DeletePostDialog from "../forms/DeletePostDialog";
import type { NoticePost } from "@/types/NoticePost";
import type { useNoticeBoard } from "@/hooks/use-notice-board";

interface Props {
  post: NoticePost;
  isLatest: boolean;
  isAdmin: boolean;
  noticeBoardState: ReturnType<typeof useNoticeBoard>;
  onView: (post: NoticePost) => void;
}

const MONTH_SHORT = { month: "short", day: "numeric", year: "numeric" } as const;

export default function AnnouncementCard({
  post,
  isLatest,
  isAdmin,
  noticeBoardState,
  onView,
}: Props) {
  const dateLabel = new Date(post.createdAt).toLocaleDateString("en-US", MONTH_SHORT);

  const initials = post.authorName
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "??";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onView(post)}
      onKeyDown={(e) => e.key === "Enter" && onView(post)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
    >
      {/* ── Hero image ───────────────────────────────────────── */}
      {post.image && (
        <div className="relative h-48 w-full overflow-hidden bg-muted shrink-0">
          {/* blurred backdrop */}
          <img
            src={post.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl opacity-60"
          />
          {/* main image */}
          <img
            src={post.image}
            alt={post.title}
            className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {/* bottom fade for text legibility */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Latest pill — bottom-left over image */}
          {isLatest && (
            <span className="absolute bottom-3 left-3 z-20 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary-foreground shadow">
              <span className="size-1.5 rounded-full bg-primary-foreground/80 animate-pulse" />
              Latest
            </span>
          )}

          {/* Admin actions — top-right, reveal on hover */}
          {isAdmin && (
            <div
              className="absolute top-2.5 right-2.5 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <EditPostDialog post={post} noticeBoardState={noticeBoardState}>
                <Button variant="secondary" size="icon-sm" className="shadow backdrop-blur-sm bg-white/80 hover:bg-white">
                  <Pencil className="size-3.5" />
                </Button>
              </EditPostDialog>
              <DeletePostDialog post={post} noticeBoardState={noticeBoardState}>
                <Button variant="secondary" size="icon-sm" className="shadow backdrop-blur-sm bg-white/80 hover:bg-white">
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </DeletePostDialog>
            </div>
          )}
        </div>
      )}


      <div className="flex flex-1 flex-col gap-3 p-4">

        {/* No-image: latest badge + admin actions inline */}
        {!post.image && (
          <div className="flex items-center justify-between -mb-1">
            <div>
              {isLatest && (
                <Badge className="rounded-full bg-red-100 text-red-600 border-0 text-[10px] font-semibold px-2.5">
                  <span className="mr-1 size-1.5 rounded-full bg-red-600 inline-block animate-pulse" />
                  Latest
                </Badge>
              )}
            </div>
            {isAdmin && (
              <div
                className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <EditPostDialog post={post} noticeBoardState={noticeBoardState}>
                  <Button variant="ghost" size="icon-sm">
                    <Pencil className="size-3.5" />
                  </Button>
                </EditPostDialog>
                <DeletePostDialog post={post} noticeBoardState={noticeBoardState}>
                  <Button variant="ghost" size="icon-sm">
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </DeletePostDialog>
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground">
          {post.title}
        </h3>

        {/* Content preview */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {post.content}
        </p>

        {/* Footer: author + date */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/40 mt-auto">
          <Avatar className="size-6 shrink-0 ring-2 ring-background">
            <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-foreground truncate flex-1">
            {post.authorName}
          </span>
          <time
            dateTime={post.createdAt}
            className="text-[10px] text-muted-foreground shrink-0 tabular-nums"
          >
            {dateLabel}
          </time>
        </div>
      </div>
    </article>
  );
}
