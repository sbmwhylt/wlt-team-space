import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Pencil, Trash2, ImageIcon, Calendar } from "lucide-react";
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

export default function AnnouncementCard({
  post,
  isLatest,
  isAdmin,
  noticeBoardState,
  onView,
}: Props) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Card
      className="group shadow-none p-0 overflow-hidden border border-border/60 transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer bg-card"
      onClick={() => onView(post)}
    >
      {post.image ? (
        <div className="relative h-[200px] w-full overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 backdrop-blur-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {isLatest && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 shadow-sm">
              Latest
            </Badge>
          )}
        </div>
      ) : (
        <div className="relative flex items-center justify-center h-[100px] w-full bg-gradient-to-br from-primary/5 to-primary/10">
          <ImageIcon className="size-8 text-primary/20" />
          {isLatest && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 shadow-sm">
              Latest
            </Badge>
          )}
        </div>
      )}

      <CardHeader className="px-4 pt-4 pb-2 gap-0">
        <div className="flex gap-3 items-center">
          <Avatar className="size-9 shrink-0">
            <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
              {post.authorName
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-sm font-semibold line-clamp-1 leading-snug">
              {post.title}
            </CardTitle>
            <div className="flex items-center gap-1 mt-0.5 text-muted-foreground">
              <Calendar size={10} />
              <span className="text-[12px]">{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
        {isAdmin && (
          <CardAction>
            <div
              className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-1">
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {post.content}
        </p>
      </CardContent>
    </Card>
  );
}
