import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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
      className="group shadow-none p-0 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20 cursor-pointer"
      onClick={() => onView(post)}
    >
      {post.image ? (
        <div className="relative h-[210px] w-full overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {isLatest && (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-[10px] px-1.5 py-0.5">
              Latest
            </Badge>
          )}
        </div>
      ) : (
        <div className="relative flex items-center justify-center h-[120px] w-full bg-gradient-to-br from-muted/40 to-muted/80">
          <ImageIcon className="size-8 text-muted-foreground/20" />
          {isLatest && (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-[10px] px-1.5 py-0.5">
              Latest
            </Badge>
          )}
        </div>
      )}

      <CardHeader className="gap-0">
        <div className="flex gap-4 items-center">
          <CardDescription className="flex items-center gap-2">
            <Avatar className="size-10">
              <AvatarFallback className="text-[18px] bg-primary/10 text-primary">
                {post.authorName
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </CardDescription>
          <div className="group">
            <CardTitle className="text-md font-semibold line-clamp-1">
              {post.title}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Calendar size={10} />
              <p className="text-[10px]">{formatDate(post.createdAt)}</p>
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

      <CardContent className="pb-4">
        <p className="text-xs text-muted-foreground whitespace-pre-line line-clamp-2 leading-relaxed">
          {post.content}
        </p>
      </CardContent>
    </Card>
  );
}
